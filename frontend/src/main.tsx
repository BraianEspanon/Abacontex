import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App';
import './index.css';
import keycloak from './keycloak';
import { config } from './config';

const queryClient = new QueryClient();

if (config.ENVIRONMENT === 'development') {
  window.keycloak = keycloak;
}

keycloak
  .init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    console.log('Authenticated:', authenticated);

    ReactDOM.createRoot(document.getElementById('root')!).render(
      < QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      
   
    );
  })
  .catch((error) => {
    console.error('Keycloak init failed', error);
  });




