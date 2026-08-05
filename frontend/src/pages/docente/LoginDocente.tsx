import { useEffect, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

export default function LoginDocente() {
  const { keycloak, initialized } = useKeycloak();
  const loginIniciado = useRef(false);

  useEffect(() => {
    if (!initialized || keycloak.authenticated || loginIniciado.current) {
      return;
    }

    loginIniciado.current = true;

    void keycloak.login({
      redirectUri: `${window.location.origin}/inicio`,
    });
  }, [initialized, keycloak]);

  if (initialized && keycloak.authenticated) {
    return <Navigate to="/inicio" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-abacontex-dark px-5 text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-abacontex-primary-three" />

        <p className="mt-5 text-base text-white/80">Redirigiendo al inicio de sesión...</p>
      </div>
    </main>
  );
}
