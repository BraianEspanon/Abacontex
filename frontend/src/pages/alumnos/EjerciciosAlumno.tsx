import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import FiltrosEjerciciosAlumno from '../../components/ejercicios/FiltrosEjerciciosAlumno';
import ResumenEjerciciosAlumno from '../../components/ejercicios/ResumenEjerciciosAlumno';
import CardEjercicioAlumno from '../../components/ejercicios/CardEjercicioAlumno';
import PaginacionEjercicios from '../../components/ejercicios/PaginacionEjercicios';

import { useDebounce } from '../../hooks/useDebounce';
import { useEjerciciosAlumno } from '../../hooks/useEjerciciosAlumno';
import { useFiltrosEjerciciosAlumno } from '../../hooks/useFiltrosEjerciciosAlumno';

import type { EstadoEntregaAlumno } from '../../types/entrega.types';

const PAGE_SIZE = 6;

export default function EjerciciosAlumno() {
  const [busqueda, setBusqueda] = useState('');
  const [docenteId, setDocenteId] = useState('');
  const [estado, setEstado] = useState<EstadoEntregaAlumno | 'TODAS'>('TODAS');

  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebounce(busqueda, 400);

  const { data: opcionesFiltros, isError: errorFiltros } = useFiltrosEjerciciosAlumno();

  const { data, isLoading, isError, refetch } = useEjerciciosAlumno({
    page,
    pageSize: PAGE_SIZE,
    busqueda: busquedaDebounced.trim() || undefined,
    docenteId: docenteId || undefined,
    estado,
  });

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setPage(1);
  };

  const cambiarDocente = (valor: string) => {
    setDocenteId(valor);
    setPage(1);
  };

  const cambiarEstado = (valor: EstadoEntregaAlumno | 'TODAS') => {
    setEstado(valor);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setDocenteId('');
    setEstado('TODAS');
    setPage(1);
  };

  return (
    <div className="space-y-6 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Mis ejercicios</span>
      </nav>

      <FiltrosEjerciciosAlumno
        busqueda={busqueda}
        docenteId={docenteId}
        estado={estado}
        docentes={opcionesFiltros?.docentes ?? []}
        estados={opcionesFiltros?.estados ?? []}
        onBusquedaChange={cambiarBusqueda}
        onDocenteChange={cambiarDocente}
        onEstadoChange={cambiarEstado}
        onLimpiarFiltros={limpiarFiltros}
      />

      {data && <ResumenEjerciciosAlumno resumen={data.resumen} />}

      {data && data.items.length > 0 && (
        <section className="grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((ejercicio) => (
            <CardEjercicioAlumno key={ejercicio.idEjercicio} ejercicio={ejercicio} />
          ))}
        </section>
      )}

      {data && data.totalItems > 0 && (
        <PaginacionEjercicios
          page={page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {errorFiltros && <p className="text-sm text-red-600">No fue posible cargar los filtros.</p>}

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando ejercicios...</p>}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">No fue posible cargar los ejercicios.</p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 cursor-pointer text-sm font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-abacontex-gray-text">
            No hay ejercicios para mostrar.
          </p>
        </div>
      )}
    </div>
  );
}
