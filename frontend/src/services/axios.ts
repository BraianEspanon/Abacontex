import axios from 'axios';
import { config } from '../config';
import keycloak from './keycloak';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (request) => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30);

    if (keycloak.token) {
      request.headers.set('Authorization', `Bearer ${keycloak.token}`);
    }
  }

  return request;
});

export default api;
