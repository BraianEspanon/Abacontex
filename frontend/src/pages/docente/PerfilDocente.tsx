import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import CursosAsignadosDocente from '../../components/docente/perfil/CursosAsignadosDocente';
import DatosPersonalesDocente from '../../components/docente/perfil/DatosPersonalesDocente';
import InformacionCuentaDocente from '../../components/docente/perfil/InformacionCuentaDocente';
import { useDocenteActual } from '../../hooks/useDocenteActual';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';

export default function PerfilDocente() {
  const {
    data: usuario,
    isLoading: cargandoUsuario,
    isError: errorUsuario,
    refetch: recargarUsuario,
  } = useUsuarioActual();

  const {
    data: docente,
    isLoading: cargandoDocente,
    isError: errorDocente,
    refetch: recargarDocente,
  } = useDocenteActual();

  if (cargandoUsuario) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Cargando información del perfil...
        </p>
      </div>
    );
  }

  if (errorUsuario || !usuario) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-800">
          No se pudo cargar el perfil
        </h1>

        <p className="mt-2 text-sm text-red-700">
          Ocurrió un problema al obtener la información del usuario.
        </p>

        <button
          type="button"
          onClick={() => void recargarUsuario()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1450px]">
      <nav
        aria-label="Migas de pan"
        className="mb-6 flex items-center gap-2 text-sm text-gray-500"
      >
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-gray-800"
        >
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={15} />

        <span className="font-medium text-gray-900">Mi perfil</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DatosPersonalesDocente usuario={usuario} />

        <div className="flex flex-col gap-6">
          <InformacionCuentaDocente usuario={usuario} />

          {cargandoDocente && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              Cargando cursos asignados...
            </div>
          )}

          {errorDocente && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              <p>No se pudieron cargar los cursos asignados.</p>

              <button
                type="button"
                onClick={() => void recargarDocente()}
                className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
              >
                Reintentar
              </button>
            </div>
          )}

          {!cargandoDocente && !errorDocente && (
            <CursosAsignadosDocente cursos={docente?.cursos ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}