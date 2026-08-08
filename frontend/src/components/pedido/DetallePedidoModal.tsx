import { X, Package } from 'lucide-react';
import { usePedidoDetalle } from '../../hooks/usePedidoDetalle';

interface DetallePedidoModalProps {
  pedidoId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetallePedidoModal({ pedidoId, isOpen, onClose }: DetallePedidoModalProps) {
  // Traemos los datos usando React Query. Solo se dispara si isOpen es true y hay un ID.
  const { data: pedido, isLoading, isError } = usePedidoDetalle(pedidoId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pedido #{pedidoId?.toString().padStart(4, '0')}
              </h2>
              <p className="text-sm text-gray-500">Detalle de los productos solicitados</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body del Modal */}
        <div className="p-6 overflow-y-auto">
          {isLoading && <div className="text-center text-gray-500 py-8 animate-pulse">Cargando detalles...</div>}
          
          {isError && <div className="text-center text-red-500 py-8">Error al cargar el detalle del pedido.</div>}
          
          {pedido && !isLoading && !isError && (
            <div className="space-y-6">
              
              {/* Info del cliente y fecha */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Cliente</span>
                  <span className="font-medium text-gray-900">{pedido.cliente}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Fecha de Registro</span>
                  <span className="font-medium text-gray-900">
                    {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Lista de Productos */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Productos</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-medium">Producto</th>
                        <th className="px-4 py-3 font-medium text-center">Cant.</th>
                        <th className="px-4 py-3 font-medium text-right">Precio Un.</th>
                        <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pedido.items.map((item) => (
                        <tr key={item.productoId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{item.nombreProducto}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{item.cantidad}</td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            ${item.precioUnitario.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            ${item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-700">TOTAL:</td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-600 text-base">
                          ${pedido.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}