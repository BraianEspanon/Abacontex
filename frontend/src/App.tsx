// src/App.tsx
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './services/keycloak';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <ReactKeycloakProvider 
      authClient={keycloak}
      initOptions={{ 
        onLoad: 'check-sso',
        // Le indicamos dónde está el archivo invisible que acabamos de crear
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }}
    >
      <LandingPage />
    </ReactKeycloakProvider>
  );
}