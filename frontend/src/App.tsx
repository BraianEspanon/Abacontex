import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter } from 'react-router-dom';
import keycloak from './services/keycloak'; // (Asegúrate de que esta ruta sea la correcta)
import AppRouter from './routes/AppRouter';
import { config } from './config';

export default function App() {
  // Reemplaza a tu antigua función syncUsuario() del main.tsx
  const handleKeycloakEvent = async (event: string) => {
    if (event === 'onAuthSuccess') {
      console.log('Autenticación exitosa, sincronizando usuario...');
      try {
        await fetch(`${config.API_URL}/auth/sync-user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        console.log('Usuario sincronizado correctamente');
      } catch (error) {
        console.error('Error sincronizando usuario', error);
      }
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      }}
      onEvent={handleKeycloakEvent}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}
