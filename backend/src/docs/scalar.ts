import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './swagger';

const scalarDocs = apiReference({
  content: swaggerSpec,

  authentication: {
    preferredSecurityScheme: 'oauth2',

    securitySchemes: {
      oauth2: {
        flows: {
          authorizationCode: {
            'x-scalar-client-id': process.env.KEYCLOAK_TESTING_CLIENT_ID,
            'x-usePkce': 'SHA-256',
            selectedScopes: [],
          },
        },
      },
    },
  },
  defaultOpenFirstTag: false,
  theme: 'saturn',
});

export default scalarDocs;
