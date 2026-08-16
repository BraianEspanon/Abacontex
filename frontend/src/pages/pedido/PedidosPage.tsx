import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetallePedidoModal from '../../components/pedido/DetallePedidoModal';
import ResumenPedidos from '../../components/pedido/ResumenPedidos';
import TableroPedidos from '../../components/pedido/TableroPedidos';

import { useDetallePedido } from '../../hooks/useDetallePedido';
import { useMarcarPedidoListo } from '../../hooks/useMarcarPedidoListo';
import { usePedidos } from '../../hooks/usePedidos';

export default function PedidosPage() {
  const navigate = useNavigate();

  const [idPedidoSeleccionado, setIdPedidoSeleccionado] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = usePedidos();

  const marcarPedidoListo = useMarcarPedidoListo();

  const {
    data: detallePedido,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetallePedido(idPedidoSeleccionado);

  const handleVerDetalle = (idPedido: number) => {
    setIdPedidoSeleccionado(idPedido);
  };

  const handleCerrarDetalle = () => {
    setIdPedidoSeleccionado(null);
  };

  const handleCrearOrdenProduccion = (idPedido: number) => {
    setIdPedidoSeleccionado(null);

    navigate(`/alumno/produccion/crear?pedidoId=${idPedido}`);
  };

  const handleMarcarListoParaEntregar = (idPedido: number) => {
    marcarPedidoListo.mutate(idPedido);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando pedidos...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar los pedidos</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar el tablero de pedidos.
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

          <span className="font-medium text-gray-700">Pedidos</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

            <p className="mt-1 text-sm text-gray-500">
              Gestioná los pedidos y realizá el seguimiento de su avance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/alumno/pedidos/registrar')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Registrar pedido
          </button>
        </header>

        <ResumenPedidos resumen={data.resumen} />

        <TableroPedidos
          kanban={data.kanban}
          onVerDetalle={handleVerDetalle}
          onMarcarListoParaEntregar={handleMarcarListoParaEntregar}
        />
      </div>

      <DetallePedidoModal
        abierto={idPedidoSeleccionado !== null}
        pedido={detallePedido}
        cargando={cargandoDetalle}
        error={errorDetalle}
        onCerrar={handleCerrarDetalle}
        onCrearOrdenProduccion={handleCrearOrdenProduccion}
      />
    </>
  );
}
