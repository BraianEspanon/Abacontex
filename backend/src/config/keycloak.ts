import { createRemoteJWKSet } from 'jose';

export const KEYCLOAK_REALM = 'abacontex';

export const KEYCLOAK_ISSUER =
  'http://localhost:8080/realms/abacontex';

export const JWKS = createRemoteJWKSet(
  new URL(
    'http://keycloak:8080/realms/abacontex/protocol/openid-connect/certs'
  )
);