import {
  KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_ADMIN_CLIENT_ID,
  KEYCLOAK_ADMIN_CLIENT_SECRET,
} from '../config/keycloak';
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
    throw new Error('No se pudo obtener token admin');
  }

  const data = await response.json();

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
    const error = await response.text();

    throw new Error(`No se pudo actualizar el usuario en Keycloak: ${error}`);
  }
}
