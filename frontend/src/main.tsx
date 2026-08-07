import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import keycloak from './services/keycloak'; // (Asegúrate de que esta ruta sea la correcta)
import { config } from './config';

const queryClient = new QueryClient();

if (config.ENVIRONMENT === 'development') {
  window.keycloak = keycloak;
}

// Renderizamos la aplicación directamente. El provider de Keycloak estará en App.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
