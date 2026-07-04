declare namespace NodeJS {
  interface ProcessEnv {
    KEYCLOAK_BASE_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_ISSUER: string;
    PORT?: string;
    KEYCLOAK_ADMIN_CLIENT_ID: string;
    KEYCLOAK_ADMIN_CLIENT_SECRET: string;
    KEYCLOAK_FRONTEND_CLIENT_ID: string;
    KEYCLOAK_TESTING_CLIENT_ID: string;
    ENVIRONMENT: string;
  }
}
