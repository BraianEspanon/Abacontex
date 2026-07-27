// src/services/keycloak.ts
import Keycloak from 'keycloak-js';

// Le decimos a TypeScript (con "as string") que estamos 100% seguros
// de que estas variables existen y son textos.
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
