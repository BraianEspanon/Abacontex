import axios from 'axios';
import { config } from '../config';
import keycloak from '../services/keycloak';

const clienteApi = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

clienteApi.interceptors.request.use(async (requestConfig) => {
  if (!keycloak.authenticated) {
    return requestConfig;
  }

  await keycloak.updateToken(30);

  if (keycloak.token) {
    requestConfig.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return requestConfig;
});

export default clienteApi;
