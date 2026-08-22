import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetalleOrdenProduccionModal from '../../components/produccion/DetalleOrdenProduccionModal';
import PlanProduccionAnual from '../../components/produccion/PlanProduccionAnual';
import ResumenOrdenesProduccion from '../../components/produccion/ResumenOrdenesProduccion';
import TableroProduccion from '../../components/produccion/TableroProduccion';
import Button from '../../components/ui/Button';

import { useDetalleOrdenProduccion } from '../../hooks/useDetalleOrdenProduccion';
import { useFinalizarOrdenProduccion } from '../../hooks/useFinalizarOrdenProduccion';
import { useIniciarOrdenProduccion } from '../../hooks/useIniciarOrdenProduccion';
import { usePlanificacionAnual } from '../../hooks/usePlanificacionAnual';
import { useProduccion } from '../../hooks/useProduccion';

export default function ProduccionPage() {
  const navigate = useNavigate();

  const [idOrdenSeleccionada, setIdOrdenSeleccionada] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useProduccion();

  const {
    data: planificacion,
    isLoading: cargandoPlanificacion,
    isError: errorPlanificacion,
    refetch: refetchPlanificacion,
  } = usePlanificacionAnual();

  const iniciarOrden = useIniciarOrdenProduccion();

  const finalizarOrden = useFinalizarOrdenProduccion();

  const {
    data: detalleOrden,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetalleOrdenProduccion(idOrdenSeleccionada);

  const handleVerDetalle = (idOrden: number) => {
    setIdOrdenSeleccionada(idOrden);
  };

  const handleCerrarDetalle = () => {
    setIdOrdenSeleccionada(null);
  };

  const handleIniciar = (idOrden: number) => {
    iniciarOrden.mutate(idOrden);
  };

  const handleFinalizar = (idOrden: number) => {
    finalizarOrden.mutate(idOrden);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando producción...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar producción</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar las órdenes de producción.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Producción</span>
        </nav>

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>

            <p className="mt-1 text-sm text-gray-500">
              Gestioná las órdenes de fabricación de tu empresa y controlá el avance de fabricación.
            </p>
          </div>

          <Button
            type="button"
            variant="solid"
            label="Crear orden"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/alumno/produccion/crear')}
            className="!px-4 !py-2.5"
          />
        </header>

        {/* Planificación anual */}
        {cargandoPlanificacion && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-sm text-gray-500">Cargando planificación de producción...</p>
            </div>
          </section>
        )}

        {errorPlanificacion && !cargandoPlanificacion && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-800">
              No fue posible cargar la planificación anual.
            </p>

            <p className="mt-1 text-sm text-red-700">
              Las órdenes de producción pueden seguir utilizándose normalmente.
            </p>

            <button
              type="button"
              onClick={() => refetchPlanificacion()}
              className="mt-3 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Reintentar
            </button>
          </section>
        )}

        {planificacion && !cargandoPlanificacion && !errorPlanificacion && (
          <PlanProduccionAnual planificacion={planificacion} />
        )}

        {/* Resumen de órdenes */}
        <ResumenOrdenesProduccion resumen={data.resumen} />

        {/* Tablero */}
        <TableroProduccion
          columnas={data.columnas}
          onVerDetalle={handleVerDetalle}
          onIniciar={handleIniciar}
          onFinalizar={handleFinalizar}
        />
      </div>

      <DetalleOrdenProduccionModal
        abierto={idOrdenSeleccionada !== null}
        orden={detalleOrden}
        cargando={cargandoDetalle}
        error={errorDetalle}
        onCerrar={handleCerrarDetalle}
        onIniciar={handleIniciar}
        onFinalizar={handleFinalizar}
        actualizando={iniciarOrden.isPending || finalizarOrden.isPending}
      />
    </>
  );
}
