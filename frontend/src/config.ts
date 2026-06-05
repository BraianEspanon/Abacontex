export const config = window.APP_CONFIG ?? {
  API_URL: import.meta.env.VITE_API_URL,

  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
  KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
  KEYCLOAK_CLIENT: import.meta.env.VITE_KEYCLOAK_CLIENT,
  KEYCLOAK_REDIRECT_URI: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
};