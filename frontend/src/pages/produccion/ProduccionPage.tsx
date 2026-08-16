import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetalleOrdenProduccionModal from '../../components/produccion/DetalleOrdenProduccionModal';
import ResumenOrdenesProduccion from '../../components/produccion/ResumenOrdenesProduccion';
import TableroProduccion from '../../components/produccion/TableroProduccion';

import { useDetalleOrdenProduccion } from '../../hooks/useDetalleOrdenProduccion';
import { useFinalizarOrdenProduccion } from '../../hooks/useFinalizarOrdenProduccion';
import { useIniciarOrdenProduccion } from '../../hooks/useIniciarOrdenProduccion';
import { useProduccion } from '../../hooks/useProduccion';

export default function ProduccionPage() {
  const navigate = useNavigate();

  const [idOrdenSeleccionada, setIdOrdenSeleccionada] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useProduccion();

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
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Producción</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>

            <p className="mt-1 text-sm text-gray-500">
              Gestioná las órdenes de fabricación de tu empresa y controla el avance de fabricación.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/alumno/produccion/crear')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6f9468] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f8059]"
          >
            <Plus className="h-4 w-4" />
            Crear orden
          </button>
        </header>

        {/* Planificación anual se incorpora después */}

        <ResumenOrdenesProduccion resumen={data.resumen} />

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
