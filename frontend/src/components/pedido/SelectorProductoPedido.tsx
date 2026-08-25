import { Package, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

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

  /*
   * Si no hay búsqueda, obtenemos los primeros productos ordenados
   * alfabéticamente.
   *
   * Si el alumno empieza a escribir, el backend filtra por nombre.
   */
  const { data, isLoading, isError } = useProductos({
    search: busquedaDebounced.trim() || undefined,
    estadoStock: 'TODOS',
    orden: 'NOMBRE_ASC',
    page: 1,
    pageSize: 50,
  });

  /*
   * No mostramos productos que ya fueron agregados
   * al pedido.
   */
  const productosDisponibles = useMemo(() => {
    return data?.items.filter((producto) => !productosSeleccionadosIds.includes(producto.id)) ?? [];
  }, [data?.items, productosSeleccionadosIds]);

  const handleSeleccionarProducto = (producto: ProductoListado) => {
    setProductoSeleccionado(producto);
    setBusqueda(producto.nombre);
    setMostrarResultados(false);
  };

  const handleQuitarSeleccion = () => {
    setProductoSeleccionado(null);
    setBusqueda('');
    setMostrarResultados(true);
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

    /*
     * Si el usuario modifica manualmente el texto después de
     * seleccionar un producto, dejamos de considerarlo seleccionado.
     */
    if (productoSeleccionado && valor !== productoSeleccionado.nombre) {
      setProductoSeleccionado(null);
    }
  };

  const handleFocus = () => {
    /*
     * Si todavía no hay producto seleccionado,
     * mostramos inmediatamente todos los productos disponibles.
     */
    if (!productoSeleccionado) {
      setMostrarResultados(true);
    }
  };

  return (
    <div>
      <label htmlFor="buscarProducto" className="mb-1.5 block text-sm font-medium text-gray-700">
        Buscar y agregar un producto
      </label>

      <div className="flex items-start gap-3">
        <div className="relative min-w-0 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              id="buscarProducto"
              type="text"
              value={busqueda}
              onChange={(event) => handleCambiarBusqueda(event.target.value)}
              onFocus={handleFocus}
              placeholder="Escribí el nombre del producto..."
              autoComplete="off"
              className={[
                'w-full rounded-lg border bg-white py-2 pl-10 text-sm outline-none transition',
                productoSeleccionado ? 'pr-10' : 'pr-3',
                'border-gray-300 focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20',
              ].join(' ')}
            />

            {productoSeleccionado && (
              <button
                type="button"
                onClick={handleQuitarSeleccion}
                aria-label="Quitar producto seleccionado"
                title="Quitar selección"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {mostrarResultados && !productoSeleccionado && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {isLoading && (
                <div className="px-4 py-3 text-sm text-gray-500">Cargando productos...</div>
              )}

              {isError && (
                <div className="px-4 py-3 text-sm text-red-600">
                  No fue posible cargar los productos.
                </div>
              )}

              {!isLoading && !isError && productosDisponibles.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  {busquedaDebounced.trim()
                    ? 'No se encontraron productos con esa búsqueda.'
                    : 'No hay productos disponibles para agregar.'}
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
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Stock disponible: {producto.stock}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

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
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span>Producto seleccionado:</span>

          <span className="font-medium text-gray-700">{productoSeleccionado.nombre}</span>

          <button
            type="button"
            onClick={handleQuitarSeleccion}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-red-600 transition hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}
