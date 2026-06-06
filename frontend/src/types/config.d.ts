import Keycloak from 'keycloak-js';

declare global {
  interface Window {
    APP_CONFIG?: {
      API_URL: string;
      KEYCLOAK_URL: string;
      KEYCLOAK_REALM: string;
      KEYCLOAK_CLIENT: string;
      ENVIRONMENT: string;
    };

    keycloak?: Keycloak;
  }
}

export {};
