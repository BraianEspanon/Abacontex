import { Search, SlidersHorizontal } from 'lucide-react';

import type { EstadoStockProducto, OrdenProductos } from '../../types/producto.types';

interface FiltrosProductosProps {
  search: string;
  estadoStock: EstadoStockProducto;
  orden: OrdenProductos;
  onSearchChange: (value: string) => void;
  onEstadoStockChange: (value: EstadoStockProducto) => void;
  onOrdenChange: (value: OrdenProductos) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosProductos({
  search,
  estadoStock,
  orden,
  onSearchChange,
  onEstadoStockChange,
  onOrdenChange,
  onLimpiarFiltros,
}: FiltrosProductosProps) {
  return (
    <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(180px,0.75fr)_minmax(180px,0.75fr)_auto] lg:items-end">
        <div>
          <label
            htmlFor="buscar-producto"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-producto"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre de producto..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
            />

            <Search
              size={17}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="estado-stock" className="mb-2 block text-sm font-semibold text-gray-800">
            Estado de stock
          </label>

          <select
            id="estado-stock"
            value={estadoStock}
            onChange={(event) => onEstadoStockChange(event.target.value as EstadoStockProducto)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
          >
            <option value="TODOS">Todos</option>
            <option value="CON_STOCK">Con stock</option>
            <option value="SIN_STOCK">Sin stock</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="orden-productos"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Ordenar por
          </label>

          <select
            id="orden-productos"
            value={orden}
            onChange={(event) => onOrdenChange(event.target.value as OrdenProductos)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
          >
            <option value="NOMBRE_ASC">Nombre A-Z</option>
            <option value="NOMBRE_DESC">Nombre Z-A</option>
            <option value="STOCK_ASC">Menor stock</option>
            <option value="STOCK_DESC">Mayor stock</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpiarFiltros}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#6f966f] transition hover:bg-[#f1f6f1] focus:outline-none focus:ring-2 focus:ring-[#769a75]/20"
        >
          <SlidersHorizontal size={16} />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
