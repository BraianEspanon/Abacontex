import { CircleAlert, Minus, Package, Plus, Trash2 } from 'lucide-react';

import type { ProductoPedidoSeleccionado } from '../../types/pedido.types';

interface TablaProductosPedidoProps {
  productos: ProductoPedidoSeleccionado[];
  onCambiarCantidad: (productoId: number, cantidad: number) => void;
  onEliminarProducto: (productoId: number) => void;
}

const MIN_CANTIDAD = 1;
const MAX_CANTIDAD = 1000;

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function TablaProductosPedido({
  productos,
  onCambiarCantidad,
  onEliminarProducto,
}: TablaProductosPedidoProps) {
  if (productos.length === 0) {
    return (
      <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-5 text-center">
        <Package className="h-7 w-7 text-gray-300" strokeWidth={1.7} />

        <p className="mt-2 text-sm font-medium text-gray-600">Todavía no agregaste productos.</p>

        <p className="mt-0.5 text-xs text-gray-500">Buscá un producto y agregalo al pedido.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[760px]">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-600">
            <th className="px-3 py-2.5">Producto</th>

            <th className="px-3 py-2.5 text-right">Precio unitario</th>

            <th className="px-3 py-2.5 text-center">Cantidad</th>

            <th className="px-3 py-2.5 text-right">Subtotal</th>

            <th className="px-3 py-2.5 text-center">Estado de stock</th>

            <th className="px-3 py-2.5 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {productos.map((producto) => {
            const subtotal = producto.precioVenta * producto.cantidad;

            const stockSuficiente = producto.stock >= producto.cantidad;

            const cantidadFaltante = Math.max(producto.cantidad - producto.stock, 0);

            return (
              <tr key={producto.id} className="bg-white transition hover:bg-gray-50/60">
                {/* Producto */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    {producto.fotoUrl ? (
                      <img
                        src={producto.fotoUrl}
                        alt={producto.nombre}
                        className="h-10 w-10 shrink-0 rounded-md border border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="max-w-[180px] truncate text-sm font-semibold text-gray-900">
                        {producto.nombre}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">Disponible: {producto.stock}</p>
                    </div>
                  </div>
                </td>

                {/* Precio */}
                <td className="px-3 py-2.5 text-right">
                  <div className="inline-flex min-w-[100px] justify-end rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {formatearMoneda(producto.precioVenta)}
                  </div>
                </td>

                {/* Cantidad */}
                <td className="px-3 py-2.5">
                  <div className="mx-auto flex w-fit items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <button
                      type="button"
                      aria-label={`Disminuir cantidad de ${producto.nombre}`}
                      onClick={() =>
                        onCambiarCantidad(
                          producto.id,
                          Math.max(MIN_CANTIDAD, producto.cantidad - 1)
                        )
                      }
                      disabled={producto.cantidad <= MIN_CANTIDAD}
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <input
                      type="number"
                      min={MIN_CANTIDAD}
                      max={MAX_CANTIDAD}
                      step={1}
                      value={producto.cantidad}
                      aria-label={`Cantidad de ${producto.nombre}`}
                      onChange={(event) => {
                        const valor = event.target.value;

                        if (valor === '') {
                          return;
                        }

                        const nuevaCantidad = Number(valor);

                        if (
                          Number.isInteger(nuevaCantidad) &&
                          nuevaCantidad >= MIN_CANTIDAD &&
                          nuevaCantidad <= MAX_CANTIDAD
                        ) {
                          onCambiarCantidad(producto.id, nuevaCantidad);
                        }
                      }}
                      className="h-9 w-14 border-x border-gray-200 text-center text-sm font-medium text-gray-800 outline-none"
                    />

                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${producto.nombre}`}
                      onClick={() =>
                        onCambiarCantidad(
                          producto.id,
                          Math.min(MAX_CANTIDAD, producto.cantidad + 1)
                        )
                      }
                      disabled={producto.cantidad >= MAX_CANTIDAD}
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-1 text-center text-[10px] text-gray-400">
                    Máximo {MAX_CANTIDAD.toLocaleString('es-AR')} u.
                  </p>
                </td>

                {/* Subtotal */}
                <td className="px-3 py-2.5 text-right text-sm font-semibold text-gray-900">
                  {formatearMoneda(subtotal)}
                </td>

                {/* Estado stock */}
                <td className="px-3 py-2.5 text-center">
                  {stockSuficiente ? (
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        En stock
                      </span>

                      <span className="mt-1 text-[11px] text-gray-500">
                        Disponible: {producto.stock}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                        <CircleAlert className="h-3.5 w-3.5" />
                        Stock bajo
                      </span>

                      <span className="mt-1 text-[11px] text-gray-500">
                        Faltan {cantidadFaltante}
                      </span>
                    </div>
                  )}
                </td>

                {/* Acciones */}
                <td className="px-3 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => onEliminarProducto(producto.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar ${producto.nombre}`}
                    title="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
