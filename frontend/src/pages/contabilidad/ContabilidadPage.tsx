import { ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';
import ResumenContabilidad from '../../components/contabilidad/ResumenContabilidad';
import TablaOperacionesPendientes from '../../components/contabilidad/TablaOperacionesPendientes';
import UltimosAsientos from '../../components/contabilidad/UltimosAsientos';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useOperacionesPendientes } from '../../hooks/useOperacionesPendientes';
import { useResumenContabilidad } from '../../hooks/useResumenContabilidad';
import { useUltimosAsientos } from '../../hooks/useUltimosAsientos';

import type { OperacionPendiente } from '../../types/contabilidad.types';

const PAGE_SIZE = 10;
const ULTIMOS_ASIENTOS_LIMIT = 5;

export default function ContabilidadPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: resumen,
    isLoading: cargandoResumen,
    isError: errorResumen,
    refetch: refetchResumen,
  } = useResumenContabilidad(tieneEmpresa);

  const {
    data: pendientes,
    isLoading: cargandoPendientes,
    isFetching: actualizandoPendientes,
    isError: errorPendientes,
    refetch: refetchPendientes,
  } = useOperacionesPendientes(
    {
      page,
      pageSize: PAGE_SIZE,
    },
    tieneEmpresa
  );

  const {
    data: ultimosAsientos,
    isLoading: cargandoUltimos,
    isError: errorUltimos,
    refetch: refetchUltimos,
  } = useUltimosAsientos(ULTIMOS_ASIENTOS_LIMIT, tieneEmpresa);

  const handleRegistrarAsiento = (operacion: OperacionPendiente) => {
    navigate(`/alumno/contabilidad/asientos/registrar/${operacion.tipo}/${operacion.id}`);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > (pendientes?.totalPages ?? 1)) {
      return;
    }

    setPage(nuevaPagina);
  };

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
        descripcion="Para utilizar el módulo de Contabilidad primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  if (cargandoResumen || cargandoPendientes || cargandoUltimos) {
    return <EstadoCarga mensaje="Cargando contabilidad..." />;
  }

  if (
    errorResumen ||
    errorPendientes ||
    errorUltimos ||
    !resumen ||
    !pendientes ||
    !ultimosAsientos
  ) {
    return (
      <EstadoError
        titulo="No fue posible cargar Contabilidad"
        descripcion="Ocurrió un problema al consultar la información contable de la empresa."
        onReintentar={() => {
          void refetchResumen();
          void refetchPendientes();
          void refetchUltimos();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Gestión contable</span>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Libro diario</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>

        <p className="mt-1 text-sm text-gray-500">
          Gestioná los asientos contables de las operaciones de tu empresa.
        </p>
      </header>

      {/* Tabs */}
      <NavegacionContabilidad activa="LIBRO_DIARIO" />

      {/* Métricas */}
      <ResumenContabilidad
        asientosRegistrados={resumen.asientosRegistradosCount}
        pendientesRegistrar={resumen.pendientesRegistrarCount}
      />

      {/* Operaciones pendientes */}
      <TablaOperacionesPendientes
        operaciones={pendientes.items}
        page={pendientes.page}
        totalPages={pendientes.totalPages}
        totalItems={pendientes.totalItems}
        cargando={actualizandoPendientes}
        onRegistrar={handleRegistrarAsiento}
        onCambiarPagina={handleCambiarPagina}
      />

      {/* Últimos asientos */}
      <UltimosAsientos
        asientos={ultimosAsientos}
        onVerLibroDiario={() => navigate('/alumno/contabilidad/libro-diario')}
      />
    </div>
  );
}

function EstadoCarga({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-gray-500">{mensaje}</p>
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
      <h2 className="font-semibold text-red-800">{titulo}</h2>

      <p className="mt-1 text-sm text-red-700">{descripcion}</p>

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
