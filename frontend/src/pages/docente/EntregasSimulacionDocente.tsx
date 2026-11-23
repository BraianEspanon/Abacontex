import { ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Button from '../../components/ui/Button';

import CabeceraEntregasSimulacion from '../../components/simulacion/CabeceraEntregasSimulacion';
import CardEntregaSimulacion from '../../components/simulacion/CardEntregaSimulacion';
import FiltrosEntregasSimulacion from '../../components/simulacion/FiltrosEntregasSimulacion';
import PaginacionSimulaciones from '../../components/simulacion/PaginacionSimulaciones';

import { useDebounce } from '../../hooks/useDebounce';
import { useEntregasSimulacion } from '../../hooks/useEntregasSimulacion';

import type { EstadoEntregaSimulacion } from '../../types/simulacion.types';

const PAGE_SIZE = 6;

export default function EntregasSimulacionDocente() {
  const { id } = useParams();

  const idSimulacion = Number(id);

  const [busqueda, setBusqueda] = useState('');

  const [estado, setEstado] = useState<EstadoEntregaSimulacion>('TODOS');

  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebounce(busqueda, 400);

  const { data, isLoading, isError, refetch } = useEntregasSimulacion(idSimulacion, {
    page,
    pageSize: PAGE_SIZE,
    search: busquedaDebounced.trim() || undefined,
    estado,
  });

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setPage(1);
  };

  const cambiarEstado = (nuevoEstado: EstadoEntregaSimulacion) => {
    setEstado(nuevoEstado);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstado('TODOS');
    setPage(1);
  };

  if (!Number.isInteger(idSimulacion)) {
    return <p className="text-sm text-red-600">La simulación indicada no es válida.</p>;
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={16} />

        <Link to="/docente/simulaciones" className="transition hover:text-abacontex-dark">
          Mis simulaciones
        </Link>

        <ChevronRight size={16} />

        <span className="font-semibold text-abacontex-dark">Entregas</span>
      </nav>

      {data && <CabeceraEntregasSimulacion simulacion={data.simulacion} />}

      <FiltrosEntregasSimulacion
        busqueda={busqueda}
        estado={estado}
        onBusquedaChange={cambiarBusqueda}
        onEstadoChange={cambiarEstado}
        onLimpiar={limpiarFiltros}
      />

      {data && (
        <h2 className="text-xl font-semibold">Empresas participantes ({data.totalItems})</h2>
      )}

      {data && data.items.length > 0 && (
        <section className="space-y-4">
          {data.items.map((entrega) => (
            <CardEntregaSimulacion
              key={entrega.idSimulacionEmpresa}
              entrega={entrega}
              idSimulacion={idSimulacion}
            />
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

      {isLoading && (
        <p className="text-sm text-abacontex-gray-text">Cargando empresas participantes...</p>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            No fue posible cargar las entregas de la simulación.
          </p>

          <Button
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={() => void refetch()}
            className="mt-3 h-9! rounded-lg! px-4! py-0! text-sm!"
          />
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-abacontex-gray-text">No hay empresas para mostrar.</p>
        </div>
      )}
    </div>
  );
}
