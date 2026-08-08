import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePedidos } from '../../hooks/usePedidos';
import { useActualizarEstadoPedido } from '../../hooks/useActualizarEstadoPedido';
import ResumenPedidos from '../../components/pedido/ResumenPedidos';
import TableroKanbanPedidos from '../../components/pedido/TableroKanbanPedidos';
import DetallePedidoModal from '../../components/pedido/DetallePedidoModal';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import type { EstadoPedido } from '../../types/pedido.types';

export default function PedidosPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = usePedidos({ page: 1, pageSize: 100 });
  const { mutateAsync: actualizarEstado } = useActualizarEstadoPedido();

  const [pedidoIdSeleccionado, setPedidoIdSeleccionado] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalle = (id: number) => {
    setPedidoIdSeleccionado(id);
    setIsModalOpen(true);
  };

  const handleCambiarEstado = async (id: number, nuevoEstado: EstadoPedido) => {
    try {
      await actualizarEstado({ id, estado: nuevoEstado });
    } catch (error) {
      console.error('Error al mover la tarjeta de estado:', error);
    }
  };

  const listaPedidos = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las órdenes de compra y facturación de la empresa.
          </p>
        </div>
        <Button
          onClick={() => navigate('/alumno/pedidos/nuevo')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          label="Nuevo Pedido"
          icon={<Plus size={18} />}
        />
      </div>

      {/* Métricas Dinámicas */}
      <ResumenPedidos pedidos={listaPedidos} />

      {/* Tablero Kanban (4 Columnas Exactas) */}
      <TableroKanbanPedidos
        pedidos={listaPedidos}
        isLoading={isLoading}
        isError={isError}
        onCambiarEstado={handleCambiarEstado}
        onVerDetalle={handleVerDetalle}
      />

      {/* Modal de Detalle */}
      <DetallePedidoModal
        pedidoId={pedidoIdSeleccionado}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setPedidoIdSeleccionado(null), 300);
        }}
      />
    </div>
  );
}
