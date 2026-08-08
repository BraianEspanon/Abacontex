import { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useActualizarEstadoPedido } from '../../hooks/useActualizarEstadoPedido';
import type { EstadoPedido } from '../../types/pedido.types';
import Button from '../ui/Button';

interface ActualizarEstadoModalProps {
  pedidoId: number | null;
  estadoActual: EstadoPedido | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActualizarEstadoModal({ pedidoId, estadoActual, isOpen, onClose }: ActualizarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido>('PENDIENTE');
  const { mutateAsync: actualizarEstado, isPending } = useActualizarEstadoPedido();

  // Sincronizar el estado local cuando se abre el modal
  useEffect(() => {
    if (estadoActual) setNuevoEstado(estadoActual);
  }, [estadoActual, isOpen]);

  if (!isOpen || !pedidoId) return null;

  const handleSubmit = async () => {
    try {
      await actualizarEstado({ id: pedidoId, estado: nuevoEstado });
      onClose(); // Cerramos si fue exitoso
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <RefreshCw size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Actualizar Estado</h2>
              <p className="text-sm text-gray-500">Pedido #{pedidoId.toString().padStart(4, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar nuevo estado</label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoPedido)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PREPARACION">En Preparación</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isPending} label="Cancelar" />
          <Button 
            onClick={handleSubmit} 
            disabled={isPending} 
            label={isPending ? "Guardando..." : "Guardar Cambios"} 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
          />
        </div>

      </div>
    </div>
  );
}