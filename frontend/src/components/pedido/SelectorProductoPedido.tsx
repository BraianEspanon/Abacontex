import { Package, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Button from '../ui/Button';

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
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoListado | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

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

  /*
   * Si el producto seleccionado ya fue agregado por alguna razón,
   * limpiamos la selección.
   */
  useEffect(() => {
    if (productoSeleccionado && productosSeleccionadosIds.includes(productoSeleccionado.id)) {
      setProductoSeleccionado(null);
      setBusqueda('');
    }
  }, [productoSeleccionado, productosSeleccionadosIds]);

  const handleSeleccionarProducto = (producto: ProductoListado) => {
    setProductoSeleccionado(producto);
    setBusqueda(producto.nombre);
    setMostrarResultados(false);
  };

  const handleAgregarProducto = () => {
    if (!productoSeleccionado) {
      return;
    }

    onAgregarProducto(productoSeleccionado);

    setProductoSeleccionado(null);
    setBusqueda('');
    setMostrarResultados(false);
  };

  const handleCambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setMostrarResultados(true);

    if (productoSeleccionado && valor !== productoSeleccionado.nombre) {
      setProductoSeleccionado(null);
    }
  };

  return (
    <div>
      <label htmlFor="buscarProducto" className="mb-1.5 block text-sm font-medium text-gray-700">
        Buscar y agregar un producto
      </label>

      <div className="flex items-start gap-3">
        {/* Buscador */}
        <div className="relative min-w-0 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="buscarProducto"
              type="text"
              value={busqueda}
              onChange={(event) => handleCambiarBusqueda(event.target.value)}
              onFocus={() => setMostrarResultados(true)}
              placeholder="Escribí el nombre del producto..."
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20"
            />
          </div>

          {/* Resultados */}
          {mostrarResultados && busquedaDebounced.trim() !== '' && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {isLoading && (
                <div className="px-4 py-3 text-sm text-gray-500">Buscando productos...</div>
              )}

              {isError && (
                <div className="px-4 py-3 text-sm text-red-600">
                  No fue posible cargar los productos.
                </div>
              )}

              {!isLoading && !isError && productosDisponibles.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No se encontraron productos disponibles.
                </div>
              )}

              {!isLoading &&
                !isError &&
                productosDisponibles.map((producto) => (
                  <button
                    key={producto.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSeleccionarProducto(producto)}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-left transition last:border-b-0 hover:bg-gray-50"
                  >
                    {producto.fotoUrl ? (
                      <img
                        src={producto.fotoUrl}
                        alt={producto.nombre}
                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </p>

                      <p className="text-xs text-gray-500">Stock disponible: {producto.stock}</p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Agregar */}
        <Button
          type="button"
          label="Agregar producto"
          variant="solid"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleAgregarProducto}
          disabled={!productoSeleccionado}
          className="!h-9 shrink-0 !rounded-lg !px-4 !py-2 !text-sm"
        />
      </div>

      {productoSeleccionado && (
        <p className="mt-1.5 text-xs text-gray-500">
          Producto seleccionado:{' '}
          <span className="font-medium text-gray-700">{productoSeleccionado.nombre}</span>
        </p>
      )}
    </div>
  );
}
