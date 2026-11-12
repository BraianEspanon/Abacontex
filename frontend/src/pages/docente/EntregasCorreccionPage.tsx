import { Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CabeceraEntregas from '../../components/correcciones/CabeceraEntregas';
import FiltrosEntregas from '../../components/correcciones/FiltrosEntregas';
import TarjetaEntregaAlumno from '../../components/correcciones/TarjetaEntregaAlumno';
import PaginacionEjercicios from '../../components/ejercicios/PaginacionEjercicios';

import { useDebounce } from '../../hooks/useDebounce';
import { useEntregasCorreccion } from '../../hooks/useEntregasCorreccion';

import type { FiltroEstadoEntrega } from '../../components/correcciones/FiltrosEntregas';

const PAGE_SIZE = 10;

export default function EntregasCorreccionPage() {
  const { ejercicioId } = useParams<{ ejercicioId: string }>();
  const idEjercicio = Number(ejercicioId);

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<FiltroEstadoEntrega>('TODAS');
  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebounce(busqueda, 400);

  const { data, isLoading, isError, refetch, isFetching } = useEntregasCorreccion(idEjercicio, {
    page,
    pageSize: PAGE_SIZE,
    busqueda: busquedaDebounced.trim() || undefined,
    estado,
  });

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setPage(1);
  };

  const cambiarEstado = (valor: FiltroEstadoEntrega) => {
    setEstado(valor);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstado('TODAS');
    setPage(1);
  };

  if (!Number.isInteger(idEjercicio) || idEjercicio <= 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-red-600">
        El identificador del ejercicio no es válido.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <nav className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <Link to="/docente" aria-label="Inicio">
          <Home className="size-4" />
        </Link>

        <span>/</span>

        <Link to="/docente/correcciones" className="hover:underline">
          Correcciones
        </Link>

        <span>/</span>

        <span className="font-medium text-gray-800">Entregas</span>
      </nav>

      {isLoading ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500">
          Cargando entregas...
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-white p-10 text-center">
          <p className="mb-4 text-sm text-red-600">
            No se pudieron obtener las entregas del ejercicio.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md bg-abacontex-primary px-4 py-2 text-sm text-white"
          >
            Reintentar
          </button>
        </div>
      ) : data ? (
        <>
          <CabeceraEntregas ejercicio={data.ejercicio} />

          <FiltrosEntregas
            busqueda={busqueda}
            estado={estado}
            opcionesEstado={data.filtros.estados}
            onBusquedaChange={cambiarBusqueda}
            onEstadoChange={cambiarEstado}
            onLimpiar={limpiarFiltros}
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                Entregas de alumnos ({data.totalItems})
              </h1>

              {isFetching && <span className="text-xs text-gray-500">Actualizando...</span>}
            </div>

            {data.items.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500">
                No se encontraron alumnos con los filtros seleccionados.
              </div>
            ) : (
              <div className="space-y-3">
                {data.items.map((entrega) => (
                  <TarjetaEntregaAlumno key={entrega.idAlumno} entrega={entrega} />
                ))}
              </div>
            )}
          </section>

          {data.totalItems > 0 && (
            <PaginacionEjercicios
              page={data.page}
              totalPages={data.totalPages}
              totalItems={data.totalItems}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
