// src/components/layout/Navbar.tsx
import { useKeycloak } from '@react-keycloak/web';
import { useScroll } from '../hooks/useScroll';
import Button from '../components/ui/Button';

export default function Navbar() {
  const { keycloak, initialized } = useKeycloak();
  const scrolled = useScroll();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 ${scrolled ? 'pt-4' : 'pt-6'}`}
    >
      <nav
        className={`w-full mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-white/50 backdrop-blur-md border border-abacontex-gray-text/30 px-6 py-3 rounded-2xl shadow-md'
            : 'bg-transparent px-6 py-4 rounded-none border-b border-transparent'
        }`}
      >
        {/* 1. LOGO */}
        <div className="flex items-center gap-2">
          <div className="font-heading text-2xl font-extrabold text-abacontex-black-text tracking-tight">
            ABACONTEX
          </div>
        </div>

        {/* 2. ENLACES DE NAVEGACIÓN */}
        <ul className="hidden lg:flex items-center gap-8 font-sans font-medium text-abacontex-gray-text text-sm">
          <li>
            <a href="#" className="hover:text-abacontex-primary transition-colors duration-300">
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#caracteristicas"
              className="hover:text-abacontex-primary transition-colors duration-300"
            >
              Características
            </a>
          </li>
          <li>
            <a
              href="#simulacion"
              className="hover:text-abacontex-primary transition-colors duration-300"
            >
              Simulación Alumnos
            </a>
          </li>
          <li>
            <a
              href="#docentes"
              className="hover:text-abacontex-primary transition-colors duration-300"
            >
              Panel Docente
            </a>
          </li>
        </ul>

        {/* 3. BOTONES Y ESTADO DE SESIÓN (Keycloak) */}
        <div className="flex items-center gap-4">
          {!initialized && (
            <span className="text-sm font-sans text-abacontex-gray-text animate-pulse">
              Conectando...
            </span>
          )}

          {initialized && !keycloak.authenticated && (
            <>
              <div className="hidden sm:block">
                <Button
                  label="Iniciar Sesión"
                  variant="outline"
                  onClick={() =>
                    keycloak.login({ redirectUri: window.location.origin + '/inicio' })
                  }
                />
              </div>
              <Button
                label="Crear Cuenta"
                variant="solid"
                onClick={() =>
                  keycloak.register({ redirectUri: window.location.origin + '/inicio' })
                }
              />
            </>
          )}

          {initialized && keycloak.authenticated && (
            <div className="flex items-center gap-5">
              <span className="font-sans font-medium text-abacontex-black-text hidden md:inline">
                Hola,{' '}
                <span className="text-abacontex-primary">
                  {keycloak.tokenParsed?.preferred_username || 'Usuario'}
                </span>
              </span>
              <Button
                label="Cerrar Sesión"
                variant="outline"
                onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
