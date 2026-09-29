import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import EstadoResultadosCard from '../../components/contabilidad/EstadoResultadosCard';
import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEstadoResultados } from '../../hooks/useEstadoResultados';

export default function EstadoResultadosPage() {
  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: reporte,
    isLoading: cargandoReporte,
    isError: errorReporte,
    refetch: refetchReporte,
  } = useEstadoResultados(tieneEmpresa);

  if (cargandoAlumno) {
    return <EstadoCarga mensaje="Cargando información contable..." />;
  }

  if (errorAlumno || !alumno) {
    return (
      <EstadoError
        titulo="No fue posible cargar tus datos"
        descripcion="Ocurrió un problema al consultar la información del alumno."
        onReintentar={() => void refetchAlumno()}
      />
    );
  }

  if (!tieneEmpresa) {
    return (
      <EstadoError
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para consultar el Estado de Resultados primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  if (cargandoReporte) {
    return <EstadoCarga mensaje="Cargando Estado de Resultados..." />;
  }

  if (errorReporte || !reporte) {
    return (
      <EstadoError
        titulo="No fue posible cargar el Estado de Resultados"
        descripcion="Ocurrió un problema al consultar la información contable."
        onReintentar={() => void refetchReporte()}
      />
    );
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/alumno"
          className="inline-flex items-center gap-1.5 text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          <Home className="size-4 shrink-0" />
          <span>Inicio</span>
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <Link
          to="/alumno/contabilidad"
          className="text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          Gestión contable
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <span className="font-semibold text-abacontex-black-text">Estado de resultado</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold text-abacontex-black-text">Contabilidad</h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Consultá los ingresos, egresos y el resultado del período.
        </p>
      </header>

      <NavegacionContabilidad activa="ESTADO_RESULTADO" />

      <div className="pt-4">
        <EstadoResultadosCard reporte={reporte} />
      </div>
    </div>
  );
}

function EstadoCarga({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-75 items-center justify-center">
      <p className="text-sm font-medium text-abacontex-gray-text">{mensaje}</p>
    </div>
  );
}

interface EstadoErrorProps {
  titulo: string;
  descripcion: string;
  onReintentar?: () => void;
  mostrarReintentar?: boolean;
}

function EstadoError({
  titulo,
  descripcion,
  onReintentar,
  mostrarReintentar = true,
}: EstadoErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-sans">
      <h2 className="font-semibold text-red-800">{titulo}</h2>

      <p className="mt-1 text-sm text-red-700">{descripcion}</p>

      {mostrarReintentar && onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
