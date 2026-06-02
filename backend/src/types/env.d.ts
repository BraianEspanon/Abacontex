declare namespace NodeJS {
  interface ProcessEnv {
    KEYCLOAK_BASE_URL: string;
    KEYCLOAK_REALM: string;
    PORT?: string;
  }
}