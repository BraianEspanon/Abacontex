import { createRemoteJWKSet } from 'jose';

export const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL;
export const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER;

export { KEYCLOAK_ISSUER };

export const JWKS = createRemoteJWKSet(
  new URL(`${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`)
);

export const KEYCLOAK_ADMIN_CLIENT_ID = process.env.KEYCLOAK_ADMIN_CLIENT_ID!;
export const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!;
export const KEYCLOAK_FRONTEND_CLIENT_ID = process.env.KEYCLOAK_FRONTEND_CLIENT_ID!;
