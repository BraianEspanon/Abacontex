import { ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import CardSimulacionAlumno from '../../components/simulacion/CardSimulacionAlumno';
import FiltrosSimulacionesAlumno from '../../components/simulacion/FiltrosSimulacionesAlumno';
import PaginacionSimulaciones from '../../components/simulacion/PaginacionSimulaciones';
import ResumenSimulacionesAlumno from '../../components/simulacion/ResumenSimulacionesAlumno';

import { useDebounce } from '../../hooks/useDebounce';
import {
  useFiltrosSimulacionesAlumno,
  useSimulacionesAlumno,
} from '../../hooks/useSimulacionesAlumno';

import type { EstadoFiltroSimulacionAlumno } from '../../types/simulacion.types';

const PAGE_SIZE = 6;

export default function SimulacionesAlumno() {
  const [titulo, setTitulo] = useState('');

  const [estado, setEstado] = useState<EstadoFiltroSimulacionAlumno>('TODAS');

  const [page, setPage] = useState(1);

  const tituloDebounced = useDebounce(titulo, 400);

  const { data: filtros, isError: errorFiltros } = useFiltrosSimulacionesAlumno();

  const { data, isLoading, isError, refetch } = useSimulacionesAlumno({
    page,
    pageSize: PAGE_SIZE,
    titulo: tituloDebounced.trim() || undefined,
    estado,
  });

  function cambiarTitulo(valor: string) {
    setTitulo(valor);
    setPage(1);
  }

  function cambiarEstado(nuevoEstado: EstadoFiltroSimulacionAlumno) {
    setEstado(nuevoEstado);
    setPage(1);
  }

  function limpiarFiltros() {
    setTitulo('');
    setEstado('TODAS');
    setPage(1);
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={16} />

        <span className="font-semibold text-abacontex-dark">Mis simulaciones</span>
      </nav>

      <FiltrosSimulacionesAlumno
        titulo={titulo}
        estado={estado}
        estados={
          filtros?.estados ?? [
            {
              clave: 'TODAS',
              label: 'Todas',
            },
          ]
        }
        onTituloChange={cambiarTitulo}
        onEstadoChange={cambiarEstado}
        onLimpiar={limpiarFiltros}
      />

      {data && <ResumenSimulacionesAlumno resumen={data.resumen} />}

      {data && data.items.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((simulacion) => (
            <CardSimulacionAlumno key={simulacion.idSimulacionEmpresa} simulacion={simulacion} />
          ))}
        </section>
      )}

      {data && data.totalItems > 0 && (
        <PaginacionSimulaciones
          page={page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {errorFiltros && <p className="text-sm text-red-600">No fue posible cargar los filtros.</p>}

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando simulaciones...</p>}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            No fue posible cargar las simulaciones.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 cursor-pointer text-sm font-semibold text-abacontex-primary"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-abacontex-gray-text">No hay simulaciones para mostrar.</p>
        </div>
      )}
    </div>
  );
}
