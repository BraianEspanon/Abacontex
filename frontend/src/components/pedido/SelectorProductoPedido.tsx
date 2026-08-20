import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useDebounce } from '../../hooks/useDebounce';
import { useProductos } from '../../hooks/useProductos';

import type { ProductoListado } from '../../types/producto.types';

interface SelectorProductoPedidoProps {
  productosSeleccionadosIds: number[];
  onAgregarProducto: (producto: ProductoListado) => void;
}

export default function SelectorProductoPedido({
  productosSeleccionadosIds,
  onAgregarProducto,
}: SelectorProductoPedidoProps) {
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebounce(busqueda, 300);

  const { data, isLoading, isError } = useProductos({
    search: busquedaDebounced || undefined,
    estadoStock: 'TODOS',
    orden: 'NOMBRE_ASC',
    page: 1,
    pageSize: 20,
  });

  const productosDisponibles = useMemo(() => {
    return data?.items.filter((producto) => !productosSeleccionadosIds.includes(producto.id)) ?? [];
  }, [data?.items, productosSeleccionadosIds]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Buscar y agregar un producto
      </label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Escribí el nombre del producto..."
          className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-500">Buscando productos...</p>}

      {isError && <p className="text-sm text-red-600">No fue posible cargar los productos.</p>}

      {!isLoading && !isError && productosDisponibles.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          {productosDisponibles.map((producto) => (
            <button
              key={producto.id}
              type="button"
              onClick={() => onAgregarProducto(producto)}
              className="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{producto.nombre}</p>

                <p className="mt-1 text-xs text-gray-500">Stock disponible: {producto.stock}</p>
              </div>

              <Plus className="h-4 w-4 shrink-0 text-[#496647]" />
            </button>
          ))}
        </div>
      )}

      {!isLoading && !isError && busquedaDebounced && productosDisponibles.length === 0 && (
        <p className="text-sm text-gray-500">No se encontraron productos disponibles.</p>
      )}
    </div>
  );
}
