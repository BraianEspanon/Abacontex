import { Search } from 'lucide-react';
import type { PedidosQueryParams, EstadoPedido } from '../../types/pedido.types';

interface FiltrosPedidosProps {
  filtrosActuales: PedidosQueryParams;
  onFiltrosChange: (nuevosFiltros: Partial<PedidosQueryParams>) => void;
}

export default function FiltrosPedidos({ filtrosActuales, onFiltrosChange }: FiltrosPedidosProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Buscador */}
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          placeholder="Buscar por cliente o ID..."
          value={filtrosActuales.search || ''}
          onChange={(e) => onFiltrosChange({ search: e.target.value })}
        />
      </div>

      {/* Selector de Estado */}
      <div className="w-full sm:w-auto flex items-center gap-2">
        <label htmlFor="estado" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Estado:
        </label>
        <select
          id="estado"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg text-gray-900"
          value={filtrosActuales.estado}
          onChange={(e) => onFiltrosChange({ estado: e.target.value as EstadoPedido | 'TODOS' })}
        >
          <option value="TODOS">Todos los pedidos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PREPARACION">En Preparación</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>
    </div>
  );
}
