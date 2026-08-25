import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import keycloak from './services/keycloak';
import AppRouter from './routes/AppRouter';
import { config } from './config';

type EstadoSincronizacion = 'pendiente' | 'sincronizando' | 'sincronizado' | 'error';

function AplicacionSincronizada() {
  const { keycloak: keycloakActual, initialized } = useKeycloak();

  const [estadoSincronizacion, setEstadoSincronizacion] =
    useState<EstadoSincronizacion>('pendiente');

  const sincronizacionIniciada = useRef(false);

  useEffect(() => {
    if (!initialized || !keycloakActual.authenticated || sincronizacionIniciada.current) {
      return;
    }

    sincronizacionIniciada.current = true;

    const sincronizarUsuario = async () => {
      setEstadoSincronizacion('sincronizando');

      try {
        const response = await fetch(`${config.API_URL}/auth/sync-user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${keycloakActual.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo sincronizar el usuario.');
        }

        setEstadoSincronizacion('sincronizado');
      } catch (error) {
        console.error('Error sincronizando usuario', error);
        setEstadoSincronizacion('error');
      }
    };

    void sincronizarUsuario();
  }, [initialized, keycloakActual]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg">
        <p className="text-lg text-abacontex-gray-text">Cargando...</p>
      </div>
    );
  }

  if (!keycloakActual.authenticated) {
    return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    );
  }

  if (estadoSincronizacion === 'pendiente' || estadoSincronizacion === 'sincronizando') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg">
        <p className="text-lg text-abacontex-gray-text">Cargando tu perfil...</p>
      </div>
    );
  }

  if (estadoSincronizacion === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-abacontex-black-text">
            No pudimos cargar tu perfil
          </h1>

          <p className="mt-2 text-abacontex-gray-text">
            Ocurrió un problema al sincronizar tu usuario.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-abacontex-primary px-5 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      }}
    >
      <AplicacionSincronizada />
    </ReactKeycloakProvider>
  );
}
