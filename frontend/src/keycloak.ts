import Keycloak from 'keycloak-js';
import { config } from './config';

// 👇 Agrega esto para cazar el error
console.log('1. Lo que tiene window:', window.APP_CONFIG);
console.log('2. Lo que resolvió config.ts:', config);
console.log('3. Lo que se le va a pasar a Keycloak:', config.KEYCLOAK_URL, config.KEYCLOAK_REALM);

const keycloak = new Keycloak({
  url: config.KEYCLOAK_URL,
  realm: config.KEYCLOAK_REALM,
  clientId: config.KEYCLOAK_CLIENT,
});

export default keycloak;
