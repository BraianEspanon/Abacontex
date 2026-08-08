import TarjetaPedido from './TarjetaPedido';
import type { PedidoListado, EstadoPedido } from '../../types/pedido.types';

interface TableroKanbanPedidosProps {
  pedidos: PedidoListado[];
  isLoading: boolean;
  isError: boolean;
  onCambiarEstado: (id: number, nuevoEstado: EstadoPedido) => void;
  onVerDetalle: (id: number) => void;
}

const COLUMNAS: { id: EstadoPedido; titulo: string; colorHeader: string; badgeBg: string }[] = [
  { id: 'PENDIENTE', titulo: 'Pendientes', colorHeader: 'border-amber-400 text-amber-700', badgeBg: 'bg-amber-100 text-amber-800' },
  { id: 'EN_PREPARACION', titulo: 'En Preparación', colorHeader: 'border-blue-400 text-blue-700', badgeBg: 'bg-blue-100 text-blue-800' },
  { id: 'ENVIADO', titulo: 'Enviados', colorHeader: 'border-indigo-400 text-indigo-700', badgeBg: 'bg-indigo-100 text-indigo-800' },
  { id: 'ENTREGADO', titulo: 'Entregados', colorHeader: 'border-emerald-400 text-emerald-700', badgeBg: 'bg-emerald-100 text-emerald-800' },
];

export default function TableroKanbanPedidos({
  pedidos,
  isLoading,
  isError,
  onCambiarEstado,
  onVerDetalle,
}: TableroKanbanPedidosProps) {
  if (isLoading) return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Cargando pedidos...</div>;
  if (isError) return <div className="p-12 text-center text-red-500 font-medium">Error al cargar los pedidos.</div>;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, nuevoEstado: EstadoPedido) => {
    e.preventDefault();
    const pedidoId = Number(e.dataTransfer.getData('text/plain'));
    if (pedidoId) {
      onCambiarEstado(pedidoId, nuevoEstado);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start min-h-[500px]">
      {COLUMNAS.map((columna) => {
        const pedidosColumna = pedidos.filter((p) => p.estado === columna.id);

        return (
          <div
            key={columna.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columna.id)}
            className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80 flex flex-col min-h-[480px]"
          >
            {/* Header de la Columna */}
            <div className={`flex justify-between items-center pb-3 mb-3 border-b-2 ${columna.colorHeader}`}>
              <h3 className="font-bold text-sm text-gray-800">{columna.titulo}</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${columna.badgeBg}`}>
                {pedidosColumna.length}
              </span>
            </div>

            {/* Contenedor de Tarjetas */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
              {pedidosColumna.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400 border-2 border-dashed border-gray-200/70 rounded-xl">
                  Sin pedidos
                </div>
              ) : (
                pedidosColumna.map((pedido) => (
                  <TarjetaPedido
                    key={pedido.id}
                    pedido={pedido}
                    onVerDetalle={onVerDetalle}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}