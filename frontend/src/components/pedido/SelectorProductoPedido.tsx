import { Package, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Button from '../ui/Button';

import { useDebounce } from '../../hooks/useDebounce';
import { useProductos } from '../../hooks/useProductos';

import type { ProductoListado } from '../../types/producto.types';

interface SelectorProductoPedidoProps {
  productosSeleccionadosIds: number[];
  onAgregarProducto: (producto: ProductoListado) => void;
}

const MAX_BUSQUEDA_PRODUCTO = 100;

export default function SelectorProductoPedido({
  productosSeleccionadosIds,
  onAgregarProducto,
}: SelectorProductoPedidoProps) {
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoListado | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const selectorRef = useRef<HTMLDivElement>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

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

  /*
   * Si el usuario hace click fuera del selector,
   * cerramos únicamente el desplegable.
   *
   * Si ya existe un producto seleccionado,
   * la selección permanece intacta.
   */
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      const selector = selectorRef.current;

      if (!selector) {
        return;
      }

      if (!selector.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickFuera);

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

  /*
   * Al seleccionar un producto:
   * - guardamos el producto;
   * - limpiamos el texto del buscador;
   * - cerramos el desplegable.
   *
   * A partir de este momento se muestra el producto
   * como un chip dentro del campo.
   */
  const handleSeleccionarProducto = (producto: ProductoListado) => {
    setProductoSeleccionado(producto);
    setBusqueda('');
    setMostrarResultados(false);
  };

  /*
   * La selección solamente se elimina explícitamente
   * mediante la cruz del chip.
   */
  const handleQuitarSeleccion = () => {
    setProductoSeleccionado(null);
    setBusqueda('');
    setMostrarResultados(false);
  };

  /*
   * Agregamos el producto seleccionado al pedido
   * y dejamos nuevamente disponible el buscador.
   */
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
    /*
     * Mientras exista un producto seleccionado,
     * el buscador permanece bloqueado.
     */
    if (productoSeleccionado) {
      return;
    }

    setBusqueda(valor);
    setMostrarResultados(true);
  };

  const handleFocus = () => {
    /*
     * Si hay un producto seleccionado no volvemos
     * a desplegar los resultados.
     */
    if (productoSeleccionado) {
      return;
    }

    setMostrarResultados(true);
  };

  return (
    <div ref={selectorRef}>
      <label htmlFor="buscarProducto" className="mb-1.5 block text-sm font-medium text-gray-700">
        Buscar y agregar un producto
      </label>

      <div className="flex items-start gap-3">
        <div className="relative min-w-0 flex-1">
          {productoSeleccionado ? (
            <div className="flex h-9 w-full items-center rounded-lg border border-[#496647] bg-white px-2">
              <div className="flex max-w-full items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1">
                <Package className="h-3.5 w-3.5 shrink-0 text-gray-500" />

                <span className="max-w-[320px] truncate text-sm font-medium text-gray-700">
                  {productoSeleccionado.nombre}
                </span>

                <button
                  type="button"
                  onClick={handleQuitarSeleccion}
                  aria-label={`Quitar ${productoSeleccionado.nombre}`}
                  title="Quitar selección"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="buscarProducto"
                type="text"
                maxLength={MAX_BUSQUEDA_PRODUCTO}
                value={busqueda}
                onChange={(event) => handleCambiarBusqueda(event.target.value)}
                onFocus={handleFocus}
                placeholder="Escribí el nombre del producto..."
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm outline-none transition focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20"
              />
            </div>
          )}

          {mostrarResultados && !productoSeleccionado && (
            <div className="absolute right-0 left-0 top-[calc(100%+4px)] z-30 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
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

      {!productoSeleccionado && busqueda.length > 0 && (
        <div className="mt-1 flex justify-end">
          <span className="text-[11px] text-gray-400">
            {busqueda.length}/{MAX_BUSQUEDA_PRODUCTO}
          </span>
        </div>
      )}
    </div>
  );
}
