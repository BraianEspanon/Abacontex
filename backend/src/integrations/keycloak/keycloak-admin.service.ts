import {
  KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_ADMIN_CLIENT_ID,
  KEYCLOAK_ADMIN_CLIENT_SECRET,
  KEYCLOAK_FRONTEND_CLIENT_ID,
} from '../../config/keycloak';
import { CreateKeycloakUserDTO } from '../../dto/keycloak/create-user.dto';
import { AppError } from '../../errors/app-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { ConfigurationError } from '../../errors/configuration.error';
import { ConflictError } from '../../errors/conflict.error';
import { ExternalServiceError } from '../../errors/external-service.error';
import { NotFoundError } from '../../errors/not-found.error';
import { KeycloakGroup } from '../../types/keycloak';

export async function getAdminToken() {
  const response = await fetch(
    `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: KEYCLOAK_ADMIN_CLIENT_ID,
        client_secret: KEYCLOAK_ADMIN_CLIENT_SECRET,
      }),
    }
  );

  if (!response.ok) {
    throw new ExternalServiceError(
      'Keycloak',
      'No fue posible obtener un token de administración.',
      {
        operation: 'GET_ADMIN_TOKEN',
        status: response.status,
      }
    );
  }

  const data: { access_token: string } = await response.json();

  return data.access_token;
}

export async function createUser(data: CreateKeycloakUserDTO) {
  const token = await getAdminToken();

  try {
    const response = await fetch(`${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: 'password',
            value: data.password,
            temporary: false,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();

      switch (response.status) {
        case 400:
          throw new BadRequestError('Los datos enviados a Keycloak son inválidos.', {
            service: 'Keycloak',
            details: {
              operation: 'CREATE_USER',
              response: error,
            },
          });

        case 409:
          throw new ConflictError(
            'Ya existe un usuario con ese correo electrónico o nombre de usuario.'
          );

        default:
          throw new ExternalServiceError('Keycloak', 'No fue posible crear el usuario.', {
            details: {
              operation: 'CREATE_USER',
              status: response.status,
              response: error,
            },
          });
      }
    }

    const location = response.headers.get('location');

    if (!location) {
      throw new ExternalServiceError(
        'Keycloak',
        'Keycloak no devolvió el identificador del usuario creado.',
        {
          details: {
            operation: 'CREATE_USER',
          },
        }
      );
    }

    return location.split('/').pop()!;
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof ConflictError ||
      error instanceof ExternalServiceError
    ) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      details: {
        operation: 'CREATE_USER',
        cause: error,
      },
    });
  }
}

export async function assignRealmRole(userId: string, roleName: string) {
  const token = await getAdminToken();

  try {
    const roleResponse = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!roleResponse.ok) {
      if (roleResponse.status === 404) {
        throw new ConfigurationError(`El rol "${roleName}" no existe en Keycloak.`, {
          service: 'Keycloak',
          roleName,
        });
      }

      throw new ExternalServiceError('Keycloak', 'No fue posible consultar el rol en Keycloak.', {
        details: {
          operation: 'ASSIGN_ROLE',
          status: roleResponse.status,
          roleName,
        },
      });
    }

    const role = await roleResponse.json();

    const assignResponse = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            id: role.id,
            name: role.name,
          },
        ]),
      }
    );

    if (!assignResponse.ok) {
      throw new ExternalServiceError('Keycloak', 'No fue posible asignar el rol al usuario.', {
        details: {
          operation: 'ASSIGN_ROLE',
          status: assignResponse.status,
          userId,
          roleName,
        },
      });
    }
  } catch (error) {
    if (error instanceof ConfigurationError || error instanceof ExternalServiceError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      details: {
        operation: 'ASSIGN_ROLE',
        cause: error,
      },
    });
  }
}

export async function removeUserFromGroup(userId: string, groupName: string) {
  const token = await getAdminToken();

  try {
    const groupResponse = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/groups?search=${groupName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!groupResponse.ok) {
      throw new ExternalServiceError(
        'Keycloak',
        'No fue posible consultar los grupos en Keycloak.',
        {
          details: {
            operation: 'SEARCH_GROUP',
            status: groupResponse.status,
            groupName,
          },
        }
      );
    }

    const groups: KeycloakGroup[] = await groupResponse.json();

    const group = groups.find((g) => g.name === groupName);

    // Si el grupo no existe, no hay nada que remover.
    if (!group) {
      return;
    }

    const removeResponse = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/groups/${group.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!removeResponse.ok) {
      throw new ExternalServiceError('Keycloak', 'No fue posible remover el usuario del grupo.', {
        details: {
          operation: 'REMOVE_USER_FROM_GROUP',
          status: removeResponse.status,
          userId,
          groupName,
        },
      });
    }
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      details: {
        operation: 'REMOVE_USER_FROM_GROUP',
        cause: error,
      },
    });
  }
}
export async function deleteUser(userId: string) {
  const token = await getAdminToken();

  try {
    const response = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // El usuario ya no existe.
    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      throw new ExternalServiceError(
        'Keycloak',
        'No fue posible eliminar el usuario en Keycloak.',
        {
          details: {
            operation: 'DELETE_USER',
            status: response.status,
            userId,
          },
        }
      );
    }
  } catch (error) {
    if (error instanceof ExternalServiceError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      details: {
        operation: 'DELETE_USER',
        cause: error,
      },
    });
  }
}

export async function updateUser(
  keycloakId: string,
  data: {
    firstName: string;
    lastName: string;
  }
) {
  const token = await getAdminToken();

  const response = await fetch(
    `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${keycloakId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    }
  );
  if (!response.ok) {
    throw new ExternalServiceError('Keycloak', 'No se pudo actualizar el usuario.', {
      operation: 'UPDATE_USER',
      status: response.status,
    });
  }
}

export async function verifyPassword(email: string, password: string) {
  try {
    const response = await fetch(
      `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: KEYCLOAK_FRONTEND_CLIENT_ID,
          username: email,
          password,
        }),
      }
    );

    switch (response.status) {
      case 200:
        return;

      case 400:
      case 401:
        throw new BadRequestError('La contraseña actual es incorrecta.');

      default:
        throw new ExternalServiceError('Keycloak', 'No fue posible verificar la contraseña.', {
          operation: 'VERIFY_PASSWORD',
          status: response.status,
        });
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      operation: 'VERIFY_PASSWORD',
    });
  }
}

export async function updatePassword(keycloakId: string, newPassword: string) {
  try {
    const token = await getAdminToken();

    const response = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${keycloakId}/reset-password`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password',
          value: newPassword,
          temporary: false,
        }),
      }
    );

    switch (response.status) {
      case 204:
        return;

      case 400:
        throw new BadRequestError('La nueva contraseña no cumple con la política de seguridad.');

      default:
        throw new ExternalServiceError('Keycloak', 'No fue posible actualizar la contraseña.', {
          operation: 'UPDATE_PASSWORD',
          status: response.status,
        });
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      operation: 'UPDATE_PASSWORD',
    });
  }
}

export async function sendVerifyEmail(keycloakId: string) {
  try {
    const token = await getAdminToken();

    const queryParams = KEYCLOAK_FRONTEND_CLIENT_ID
      ? `?client_id=${encodeURIComponent(KEYCLOAK_FRONTEND_CLIENT_ID)}`
      : '';

    const response = await fetch(
      `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${keycloakId}/send-verify-email${queryParams}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 204 || response.status === 200) {
      return;
    }

    if (response.status === 404) {
      throw new NotFoundError('Usuario no encontrado en Keycloak.');
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible enviar el correo de verificación.', {
      operation: 'SEND_VERIFY_EMAIL',
      status: response.status,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new ExternalServiceError('Keycloak', 'No fue posible comunicarse con Keycloak.', {
      operation: 'SEND_VERIFY_EMAIL',
    });
  }
}
