import { Search, SlidersHorizontal } from 'lucide-react';

import type {
  EstadoStockProducto,
  OrdenProductos,
} from '../../types/producto.types';

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
    <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="buscar-producto"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Buscar
          </label>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="buscar-producto"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre de producto..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-abacontex-green"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="estado-stock"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Estado de stock
          </label>

          <select
            id="estado-stock"
            value={estadoStock}
            onChange={(event) =>
              onEstadoStockChange(
                event.target.value as EstadoStockProducto,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-green"
          >
            <option value="TODOS">Todos</option>
            <option value="CON_STOCK">Con stock</option>
            <option value="SIN_STOCK">Sin stock</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="orden-productos"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Ordenar por
          </label>

          <select
            id="orden-productos"
            value={orden}
            onChange={(event) =>
              onOrdenChange(event.target.value as OrdenProductos)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-green"
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
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-abacontex-green transition hover:bg-green-50"
        >
          <SlidersHorizontal size={16} />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}