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
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ['./src/docs/paths/*.ts', './src/docs/schemas/*.ts'],
});
