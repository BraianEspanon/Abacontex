import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import CursosAsignadosDocente from '../../components/docente/perfil/CursosAsignadosDocente';
import DatosPersonalesDocente from '../../components/docente/perfil/DatosPersonalesDocente';
import InformacionCuentaDocente from '../../components/docente/perfil/InformacionCuentaDocente';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';

export default function PerfilDocente() {
  const {
    data: usuario,
    isLoading,
    isError,
    refetch,
  } = useUsuarioActual();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Cargando información del perfil...
        </p>
      </div>
    );
  }

  if (isError || !usuario) {
    console.log(usuario);
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
          onClick={() => void refetch()}
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DatosPersonalesDocente usuario={usuario} />

        <div className="flex flex-col gap-6">
          <InformacionCuentaDocente usuario={usuario} />

          <CursosAsignadosDocente cursos={usuario.cursos ?? []} />
        </div>
      </div>
    </div>
  );
}