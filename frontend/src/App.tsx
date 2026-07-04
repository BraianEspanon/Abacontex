// src/App.tsx
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import keycloak from './services/keycloak';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: 'check-sso',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        }}
      >
        {/* ACÁ ESTÁ EL GPS ENCENDIDO */}
        <BrowserRouter>
          {/* Adentro del mapa están todas las pantallas, incluyendo la Landing y el Setup */}
          <AppRouter />
        </BrowserRouter>
      </ReactKeycloakProvider>
    </QueryClientProvider>
  );
}
