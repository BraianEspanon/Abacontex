import { CalendarDays, Check, Package, TriangleAlert, UserRound, X } from 'lucide-react';

import type { PedidoCreado } from '../../types/pedido.types';

interface PedidoRegistradoModalProps {
  abierto: boolean;
  pedido: PedidoCreado | null;
  onIrAlTablero: () => void;
  onCrearOrdenProduccion: (idPedido: number) => void;
  onCerrar: () => void;
}

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
};

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function PedidoRegistradoModal({
  abierto,
  pedido,
  onIrAlTablero,
  onCrearOrdenProduccion,
  onCerrar,
}: PedidoRegistradoModalProps) {
  if (!abierto || !pedido) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex justify-end px-5 pt-5">
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-700" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">¡Pedido registrado con éxito!</h2>

            {pedido.tieneFaltantesStock ? (
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Algunos productos no tienen stock suficiente, por lo que será necesario generar una
                orden de producción para completar el pedido.
              </p>
            ) : (
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                El pedido fue registrado correctamente y quedó disponible en el tablero.
              </p>
            )}
          </div>

          <section className="mt-6 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Package className="mt-0.5 h-4 w-4 text-[#496647]" />

              <div>
                <p className="text-xs text-gray-500">N° de pedido</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  PED-{pedido.numeroPedido.toString().padStart(5, '0')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <UserRound className="mt-0.5 h-4 w-4 text-[#496647]" />

              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{pedido.cliente}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 text-[#496647]" />

              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatearFecha(pedido.fecha)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Productos</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {pedido.cantidadProductos}{' '}
                {pedido.cantidadProductos === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Total estimado</span>

                <span className="font-bold text-gray-900">
                  {formatearMoneda(pedido.totalEstimado)}
                </span>
              </div>
            </div>
          </section>

          {pedido.tieneFaltantesStock && pedido.faltantesStock.length > 0 && (
            <section className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-amber-600" />

                <h3 className="font-semibold text-gray-900">Productos con faltante</h3>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-600">
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3 text-center">Solicitado</th>
                      <th className="px-4 py-3 text-center">Cubierto</th>
                      <th className="px-4 py-3 text-center">Faltante</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {pedido.faltantesStock.map((faltante) => (
                      <tr key={faltante.producto}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {faltante.producto}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {faltante.solicitado}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {faltante.cubierto}
                        </td>

                        <td className="px-4 py-3 text-center text-sm font-semibold text-red-600">
                          {faltante.faltante}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onIrAlTablero}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Ir al tablero
            </button>

            {pedido.tieneFaltantesStock && (
              <button
                type="button"
                onClick={() => onCrearOrdenProduccion(pedido.numeroPedido)}
                className="rounded-xl bg-[#496647] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d573c]"
              >
                Crear orden de producción
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
