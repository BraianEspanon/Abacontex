import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Abacontex API',
      version: '1.0.0',
      description: 'API REST de Abacontex',
    },

    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    tags: [
      {
        name: 'Health',
        description: 'Endpoints de verificación y monitoreo del servicio.',
      },
      {
        name: 'Auth',
        description: 'Autenticación y sincronización de usuarios.',
      },
      {
        name: 'Usuarios',
        description: 'Gestión del usuario autenticado y administración de usuarios.',
      },
      {
        name: 'Alumnos',
        description: 'Operaciones específicas de alumnos.',
      },
      {
        name: 'Empresas',
        description: 'Gestión de empresas y sus integrantes.',
      },
      {
        name: 'Docentes',
        description: 'Operaciones de creación y consulta para docentes.',
      },
      {
        name: 'Productos',
        description: 'Gestión de productos propios de cada empresa.',
      },
      {
        name: 'Cursos',
        description: 'Consulta de cursos disponibles.',
      },
      {
        name: 'Roles de empresa',
        description: 'Consulta de roles disponibles dentro de una empresa.',
      },
    ],

    components: {
      securitySchemes: {
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: process.env.KEYCLOAK_ISSUER + '/protocol/openid-connect/auth',
              tokenUrl: process.env.KEYCLOAK_ISSUER + '/protocol/openid-connect/token',
              scopes: {},
            },
          },
        },
      },
    },

    security: [
      {
        oauth2: [],
      },
    ],
  },

  apis: ['./src/docs/paths/*.ts', './src/docs/schemas/*.ts'],
});
