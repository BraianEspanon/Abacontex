import Keycloak from 'keycloak-js';

declare global {
  interface Window {
    APP_CONFIG?: {
      API_URL: string;
      SOCKET_URL?: string;
      KEYCLOAK_URL: string;
      KEYCLOAK_REALM: string;
      KEYCLOAK_CLIENT: string;
      KEYCLOAK_REDIRECT_URI?: string;
      ENVIRONMENT: string;
    };

    keycloak?: Keycloak;
  }
}

export {};
