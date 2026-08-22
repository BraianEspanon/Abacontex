import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetallePedidoModal from '../../components/pedido/DetallePedidoModal';
import ResumenPedidos from '../../components/pedido/ResumenPedidos';
import TableroPedidos from '../../components/pedido/TableroPedidos';
import Button from '../../components/ui/Button';

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

        <Button type="button" label="Reintentar" onClick={() => refetch()} className="mt-4" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Pedidos</span>
        </nav>

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

            <p className="mt-2 text-base text-gray-500">Gestioná los pedidos de tu empresa</p>
          </div>

          <Button
            type="button"
            label="Registrar pedido"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/alumno/pedidos/registrar')}
            className="self-start px-4 py-2.5 text-sm sm:self-auto"
          />
        </header>

        {/* Resumen */}
        <ResumenPedidos resumen={data.resumen} />

        {/* Kanban */}
        <TableroPedidos
          kanban={data.kanban}
          onVerDetalle={handleVerDetalle}
          onCrearOrdenProduccion={handleCrearOrdenProduccion}
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
