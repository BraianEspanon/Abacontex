import { Eye, Edit, Trash2 } from 'lucide-react';
import type { PedidoListado, EstadoPedido } from '../../types/pedido.types';

// Helper para los colores del estado
const EstadoBadge = ({ estado }: { estado: EstadoPedido }) => {
  const colores = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PREPARACION: 'bg-blue-100 text-blue-800',
    ENVIADO: 'bg-indigo-100 text-indigo-800',
    ENTREGADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colores[estado]}`}>
      {estado.replace('_', ' ')}
    </span>
  );
};

interface TablaPedidosProps {
  pedidos: PedidoListado[];
  isLoading: boolean;
  isError: boolean;
  paginacion: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onVerDetalle?: (id: number) => void;
  onEditarEstado?: (id: number, estado: EstadoPedido) => void; // <-- ACÁ AGREGAMOS LA PROP FALTANTE
}

export default function TablaPedidos({ 
  pedidos, 
  isLoading, 
  isError, 
  paginacion, 
  onVerDetalle, 
  onEditarEstado // <-- Y LA EXTRAEMOS ACÁ
}: TablaPedidosProps) {
  
  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Cargando pedidos...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Ocurrió un error al cargar los pedidos.</div>;
  if (pedidos.length === 0) return <div className="p-8 text-center text-gray-500 bg-white">No hay pedidos que coincidan con la búsqueda.</div>;

  return (
    <div className="w-full overflow-hidden"> {/* Le sacamos los bordes para que se funda con la página principal */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">ID Pedido</th>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition-colors bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">#{pedido.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-4 text-gray-900">{pedido.cliente}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ${pedido.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <EstadoBadge estado={pedido.estado} />
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => onVerDetalle?.(pedido.id)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    // <-- ACÁ CONECTAMOS EL BOTÓN DEL LÁPIZ
                    onClick={() => onEditarEstado?.(pedido.id, pedido.estado)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50" 
                    title="Actualizar Estado"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
        <span className="text-sm text-gray-600">
          Página {paginacion.page} de {paginacion.totalPages}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={paginacion.page === 1}
            onClick={() => paginacion.onPageChange(paginacion.page - 1)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Anterior
          </button>
          <button 
            disabled={paginacion.page === paginacion.totalPages}
            onClick={() => paginacion.onPageChange(paginacion.page + 1)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}