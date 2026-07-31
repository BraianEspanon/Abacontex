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

    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    SMTP_FROM: string;
    SMTP_FROM_NAME: string;

    FRONTEND_URL: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
