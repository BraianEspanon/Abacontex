import { AlertTriangle, CalendarDays, Mail, Package, UserRound, X } from 'lucide-react';

import type { EstadoPedido, PedidoDetalle } from '../../types/pedido.types';

interface DetallePedidoModalProps {
  abierto: boolean;
  pedido: PedidoDetalle | undefined;
  cargando: boolean;
  error: boolean;
  onCerrar: () => void;
  onCrearOrdenProduccion?: (idPedido: number) => void;
}

const nombresEstado: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PRODUCCION: 'En producción',
  LISTO_PARA_ENTREGAR: 'Finalizado',
  COMPLETADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
};

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function DetallePedidoModal({
  abierto,
  pedido,
  cargando,
  error,
  onCerrar,
  onCrearOrdenProduccion,
}: DetallePedidoModalProps) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">Detalle del pedido</h2>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cargando && (
          <div className="flex min-h-64 items-center justify-center p-6">
            <p className="text-sm text-gray-500">Cargando detalle del pedido...</p>
          </div>
        )}

        {error && !cargando && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">No fue posible cargar el pedido.</p>

              <p className="mt-1 text-sm text-red-700">Cerrá el detalle e intentá nuevamente.</p>
            </div>
          </div>
        )}

        {pedido && !cargando && !error && (
          <div className="space-y-6 p-6">
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <Package className="mt-0.5 h-5 w-5 shrink-0 text-[#496647]" />

                <div>
                  <p className="text-xs text-gray-500">N° de pedido</p>

                  <p className="mt-1 font-semibold text-[#496647]">
                    PED-{pedido.numeroPedido.toString().padStart(5, '0')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#496647]" />

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Correo electrónico</p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-800">
                    {pedido.cliente.mail ?? 'Sin correo registrado'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#496647]" />

                <div>
                  <p className="text-xs text-gray-500">Fecha de registro</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatearFecha(pedido.fecha)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Estado actual</p>

                <span className="mt-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {nombresEstado[pedido.estado]}
                </span>
              </div>

              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#496647]" />

                <div>
                  <p className="text-xs text-gray-500">Cliente</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">{pedido.cliente.nombre}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Registrado por</p>

                <p className="mt-1 text-sm font-medium text-gray-800">{pedido.creadoPor}</p>
              </div>
            </section>

            {pedido.tieneFaltantesStock && (
              <section className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div>
                      <p className="font-semibold text-red-700">Stock insuficiente</p>

                      <p className="mt-1 text-sm text-red-600">
                        Este pedido contiene productos pendientes de producción.
                      </p>
                    </div>
                  </div>

                  {onCrearOrdenProduccion && (
                    <button
                      type="button"
                      onClick={() => onCrearOrdenProduccion(pedido.numeroPedido)}
                      className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Crear orden de producción
                    </button>
                  )}
                </div>
              </section>
            )}

            <section>
              <h3 className="mb-3 font-semibold text-gray-900">Productos del pedido</h3>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[620px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-600">
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-right">Precio unitario</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {pedido.detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {detalle.fotoUrl ? (
                              <img
                                src={detalle.fotoUrl}
                                alt={detalle.nombre}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-medium text-gray-900">{detalle.nombre}</p>

                              {detalle.cantidadPendiente > 0 && (
                                <p className="mt-0.5 text-xs text-red-600">
                                  {detalle.cantidadPendiente} pendiente
                                  {detalle.cantidadPendiente === 1 ? '' : 's'}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {detalle.cantidad}
                        </td>

                        <td className="px-4 py-3 text-right text-sm text-gray-700">
                          {formatearMoneda(detalle.precioUnitario)}
                        </td>

                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {formatearMoneda(detalle.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="border-t border-gray-200 bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-right text-sm font-semibold text-gray-700"
                      >
                        Total estimado
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {formatearMoneda(pedido.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
