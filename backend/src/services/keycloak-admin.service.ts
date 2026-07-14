import {
  KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_ADMIN_CLIENT_ID,
  KEYCLOAK_ADMIN_CLIENT_SECRET,
  KEYCLOAK_FRONTEND_CLIENT_ID,
} from '../config/keycloak';
import { AppError } from '../errors/app-error';
import { BadRequestError } from '../errors/bad-request-error';
import { ExternalServiceError } from '../errors/external-service.error';
import { KeycloakGroup } from '../types/keycloak';

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

export async function createUser({
  username,
  email,
  firstName,
  lastName,
  password,
}: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) {
  const token = await getAdminToken();

  const response = await fetch(`${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Error creando usuario: ${error}`);
  }

  const location = response.headers.get('location');

  if (!location) {
    throw new Error('No se pudo obtener el ID del usuario');
  }

  return location.split('/').pop()!;
}

export async function assignRealmRole(userId: string, roleName: string) {
  const token = await getAdminToken();

  const roleResponse = await fetch(
    `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${roleName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!roleResponse.ok) {
    throw new Error(`No existe el rol ${roleName}`);
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
    throw new Error(`No se pudo asignar el rol ${roleName}`);
  }
}

export async function removeUserFromGroup(userId: string, groupName: string) {
  const token = await getAdminToken();

  const groupResponse = await fetch(
    `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/groups?search=${groupName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!groupResponse.ok) {
    throw new Error(`Error al buscar el grupo ${groupName}`);
  }

  const groups: KeycloakGroup[] = await groupResponse.json();
  const group = groups.find((g) => g.name === groupName);

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
    throw new Error(`No se pudo remover al usuario del grupo ${groupName}`);
  }
}

export async function deleteUser(userId: string) {
  const token = await getAdminToken();

  const response = await fetch(
    `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`No se pudo eliminar el usuario ${userId}`);
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
