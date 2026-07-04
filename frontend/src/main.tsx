import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import keycloak from './keycloak';
import { config } from './config';

const queryClient = new QueryClient();

if (config.ENVIRONMENT === 'development') {
  window.keycloak = keycloak;
}

async function syncUsuario() {
  await fetch(`${config.API_URL}/auth/sync-user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
}

keycloak
  .init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
  })
  .then(async (authenticated) => {
    console.log('Authenticated:', authenticated);

    if (authenticated) {
      try {
        await syncUsuario();
      } catch (error) {
        console.error('Error syncing user', error);
      }
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  })
  .catch((error) => {
    console.error('Keycloak init failed', error);
  });
