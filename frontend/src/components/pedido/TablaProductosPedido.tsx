import { Minus, Package, Plus, Trash2 } from 'lucide-react';

import type { ProductoPedidoSeleccionado } from '../../types/pedido.types';

interface TablaProductosPedidoProps {
  productos: ProductoPedidoSeleccionado[];
  onCambiarCantidad: (productoId: number, cantidad: number) => void;
  onEliminarProducto: (productoId: number) => void;
}

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
      <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
        <Package className="mx-auto h-8 w-8 text-gray-300" />

        <p className="mt-3 text-sm font-medium text-gray-600">Todavía no agregaste productos.</p>

        <p className="mt-1 text-xs text-gray-500">Buscá un producto y agregalo al pedido.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[850px]">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-600">
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3 text-right">Precio unitario</th>
            <th className="px-4 py-3 text-center">Cantidad</th>
            <th className="px-4 py-3 text-right">Subtotal</th>
            <th className="px-4 py-3 text-center">Estado de stock</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {productos.map((producto) => {
            const subtotal = producto.precioVenta * producto.cantidad;
            const stockSuficiente = producto.stock >= producto.cantidad;

            return (
              <tr key={producto.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {producto.fotoUrl ? (
                      <img
                        src={producto.fotoUrl}
                        alt={producto.nombre}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>

                      <p className="text-xs text-gray-500">Disponible: {producto.stock}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {formatearMoneda(producto.precioVenta)}
                </td>

                <td className="px-4 py-3">
                  <div className="mx-auto flex w-fit items-center rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        onCambiarCantidad(producto.id, Math.max(1, producto.cantidad - 1))
                      }
                      disabled={producto.cantidad <= 1}
                      className="p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={producto.cantidad}
                      onChange={(event) => {
                        const nuevaCantidad = Number(event.target.value);

                        if (
                          Number.isInteger(nuevaCantidad) &&
                          nuevaCantidad >= 1 &&
                          nuevaCantidad <= 1000
                        ) {
                          onCambiarCantidad(producto.id, nuevaCantidad);
                        }
                      }}
                      className="w-14 border-x border-gray-200 py-2 text-center text-sm outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        onCambiarCantidad(producto.id, Math.min(1000, producto.cantidad + 1))
                      }
                      disabled={producto.cantidad >= 1000}
                      className="p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  {formatearMoneda(subtotal)}
                </td>

                <td className="px-4 py-3 text-center">
                  {stockSuficiente ? (
                    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      En stock
                    </span>
                  ) : (
                    <div>
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Stock insuficiente
                      </span>

                      <p className="mt-1 text-xs text-gray-500">
                        Faltan {producto.cantidad - producto.stock}
                      </p>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onEliminarProducto(producto.id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar ${producto.nombre}`}
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
