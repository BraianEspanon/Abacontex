import { createRemoteJWKSet } from 'jose';

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER;

export { KEYCLOAK_ISSUER };

export const JWKS = createRemoteJWKSet(
  new URL(`${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`)
);
