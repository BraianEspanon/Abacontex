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
        name: 'Manual de cuentas',
        description: 'Gestión y consulta del Manual de Cuentas globales.',
      },
      {
        name: 'Productos',
        description: 'Gestión de productos propios de cada empresa.',
      },
      {
        name: 'Pedidos',
        description: 'Gestión de pedidos de cada empresa y su flujo de estado.',
      },
      {
        name: 'Producción',
        description: 'Gestión de órdenes de producción y seguimiento de estado.',
      },
      {
        name: 'Planificación',
        description: 'Gestión de la planificación anual de producción por empresa.',
      },
      {
        name: 'Ventas',
        description: 'Gestión y registro de ventas comerciales, cobranzas y dashboard de ventas.',
      },
      {
        name: 'Facturación',
        description: 'Gestión y emisión de facturas.',
      },
      {
        name: 'Finanzas',
        description: 'Gestión de caja, ingresos, egresos y conciliación financiera.',
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
