import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';
import TablaLibroDiario from '../../components/contabilidad/TablaLibroDiario';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useLibroDiario } from '../../hooks/useLibroDiario';

export default function LibroDiarioPage() {
  const navigate = useNavigate();

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: libroDiario,
    isLoading: cargandoLibroDiario,
    isError: errorLibroDiario,
    refetch: refetchLibroDiario,
  } = useLibroDiario(tieneEmpresa);

  if (cargandoAlumno) {
    return (
      <EstadoCarga mensaje="Cargando información contable..." />
    );
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
        descripcion="Para consultar el Libro Diario primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  if (cargandoLibroDiario) {
    return (
      <EstadoCarga mensaje="Cargando Libro Diario..." />
    );
  }

  if (errorLibroDiario || !libroDiario) {
    return (
      <EstadoError
        titulo="No fue posible cargar el Libro Diario"
        descripcion="Ocurrió un problema al consultar los asientos contables de la empresa."
        onReintentar={() => void refetchLibroDiario()}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link
          to="/alumno"
          className="flex items-center gap-1 transition hover:text-gray-700"
        >
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          to="/alumno/contabilidad"
          className="transition hover:text-gray-700"
        >
          Gestión contable
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">
          Libro diario
        </span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Libro Diario
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consultá los asientos contables registrados por tu empresa.
        </p>
      </header>

      {/* Navegación contable */}
      <NavegacionContabilidad activa="LIBRO_DIARIO" />

      {/* Tabla */}
      <TablaLibroDiario
        asientos={libroDiario.asientos}
        totalDebe={libroDiario.totalDebeGeneral}
        totalHaber={libroDiario.totalHaberGeneral}
        onEditar={(idAsiento) =>
          navigate(
            `/alumno/contabilidad/asientos/${idAsiento}/editar`
          )
        }
      />
    </div>
  );
}

function EstadoCarga({
  mensaje,
}: {
  mensaje: string;
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-gray-500">
        {mensaje}
      </p>
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
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="font-semibold text-red-800">
        {titulo}
      </h2>

      <p className="mt-1 text-sm text-red-700">
        {descripcion}
      </p>

      {mostrarReintentar && onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}