import { Eye, User, Calendar } from 'lucide-react';
import type { PedidoListado } from '../../types/pedido.types';

interface TarjetaPedidoProps {
  pedido: PedidoListado;
  onVerDetalle?: (id: number) => void;
}

export default function TarjetaPedido({ pedido, onVerDetalle }: TarjetaPedidoProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', pedido.id.toString());
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-3"
    >
      {/* Cabecera Tarjeta: ID + Botón Ojo */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
          #{pedido.id.toString().padStart(4, '0')}
        </span>
        <button
          type="button"
          onClick={() => onVerDetalle?.(pedido.id)}
          className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          title="Ver detalle"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Datos del Cliente y Fecha */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <User size={14} className="text-gray-400 shrink-0" />
          <span className="truncate">{pedido.cliente}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <span>{new Date(pedido.fecha).toLocaleDateString('es-AR')}</span>
        </div>
      </div>

      {/* Monto Total */}
      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">Total</span>
        <span className="text-sm font-bold text-gray-900">
          ${pedido.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
