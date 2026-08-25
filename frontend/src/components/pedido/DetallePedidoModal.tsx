import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Layers3,
  Mail,
  Package,
  UserRound,
  X,
} from 'lucide-react';

import type { EstadoPedido, PedidoDetalle } from '../../types/pedido.types';

interface DetallePedidoModalProps {
  abierto: boolean;
  pedido: PedidoDetalle | undefined;
  cargando: boolean;
  error: boolean;
  onCerrar: () => void;
  onCrearOrdenProduccion?: (idPedido: number) => void;
}

interface DatoPedidoProps {
  icono: React.ReactNode;
  etiqueta: string;
  children: React.ReactNode;
}

const nombresEstado: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PRODUCCION: 'En producción',
  LISTO_PARA_ENTREGAR: 'Listo para entregar',
  COMPLETADO: 'Completado',
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

function DatoPedido({ icono, etiqueta, children }: DatoPedidoProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center text-[#496647]">
        {icono}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] leading-4 text-gray-500">{etiqueta}</p>

        <div className="mt-[2px] text-[14px] font-medium leading-[18px] text-[#496647]">
          {children}
        </div>
      </div>
    </div>
  );
}

function obtenerClasesEstado(estado: EstadoPedido) {
  switch (estado) {
    case 'PENDIENTE':
      return 'bg-orange-50 text-orange-600';

    case 'EN_PRODUCCION':
      return 'bg-red-50 text-red-600';

    case 'LISTO_PARA_ENTREGAR':
      return 'bg-green-50 text-green-700';

    case 'COMPLETADO':
      return 'bg-green-50 text-green-700';

    case 'CANCELADO':
      return 'bg-gray-100 text-gray-600';

    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export default function DetallePedidoModal({
  abierto,
  pedido,
  cargando,
  error,
  onCerrar,
  onCrearOrdenProduccion,
}: DetallePedidoModalProps) {
  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-[14px] bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 pb-4 pt-5">
          <h2 className="text-[20px] font-semibold leading-none text-gray-900">
            Detalle del pedido
          </h2>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading */}
        {cargando && (
          <div className="flex min-h-64 items-center justify-center px-6 pb-6">
            <p className="text-sm text-gray-500">Cargando detalle del pedido...</p>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="px-6 pb-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">No fue posible cargar el pedido.</p>

              <p className="mt-1 text-sm text-red-700">Cerrá el detalle e intentá nuevamente.</p>
            </div>
          </div>
        )}

        {/* Contenido */}
        {pedido && !cargando && !error && (
          <div className="px-6 pb-6">
            {/* Información general */}
            <section className="grid grid-cols-2 gap-x-8 gap-y-4 pt-1">
              <DatoPedido icono={<Layers3 className="h-5 w-5" />} etiqueta="N° de pedido">
                <span className="font-semibold">
                  PED-{pedido.numeroPedido.toString().padStart(5, '0')}
                </span>
              </DatoPedido>

              <DatoPedido icono={<Mail className="h-5 w-5" />} etiqueta="Correo electrónico">
                <span className="break-all">{pedido.cliente.mail ?? 'Sin correo registrado'}</span>
              </DatoPedido>

              <DatoPedido icono={<CalendarDays className="h-5 w-5" />} etiqueta="Fecha de registro">
                {formatearFecha(pedido.fecha)}
              </DatoPedido>

              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center text-[#496647]">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] leading-4 text-gray-500">Estado actual</p>

                  <span
                    className={`mt-[4px] inline-flex rounded-md px-3 py-1 text-[11px] font-semibold ${obtenerClasesEstado(
                      pedido.estado
                    )}`}
                  >
                    {nombresEstado[pedido.estado]}
                  </span>
                </div>
              </div>

              <DatoPedido icono={<UserRound className="h-5 w-5" />} etiqueta="Cliente">
                {pedido.cliente.nombre}
              </DatoPedido>

              {/* Stock insuficiente ocupa el lugar de la derecha */}
              {pedido.tieneFaltantesStock && (
                <div className="rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold leading-4 text-red-600">
                        Stock insuficiente
                      </p>

                      {onCrearOrdenProduccion && (
                        <button
                          type="button"
                          onClick={() => onCrearOrdenProduccion(pedido.numeroPedido)}
                          className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Crear orden de producción
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Productos */}
            <section className="mt-5">
              <h3 className="mb-3 text-[17px] font-semibold text-gray-900">Productos del pedido</h3>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr className="text-[11px] font-medium text-gray-500">
                        <th className="w-[45%] px-3 py-2.5 text-left">Producto</th>

                        <th className="w-[15%] px-2 py-2.5 text-center">Cantidad</th>

                        <th className="w-[22%] px-2 py-2.5 text-right">Precio unitario</th>

                        <th className="w-[18%] px-3 py-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {pedido.detalles.map((detalle) => (
                        <tr key={detalle.id} className="bg-white">
                          <td className="px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                              {detalle.fotoUrl ? (
                                <img
                                  src={detalle.fotoUrl}
                                  alt={detalle.nombre}
                                  className="h-[42px] w-[42px] shrink-0 rounded-md object-cover"
                                />
                              ) : (
                                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-gray-100">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-[12px] font-semibold leading-4 text-gray-900">
                                  {detalle.nombre}
                                </p>

                                {detalle.descripcion && (
                                  <p className="mt-[2px] truncate text-[10px] leading-tight text-gray-500">
                                    {detalle.descripcion}
                                  </p>
                                )}

                                {detalle.cantidadPendiente > 0 && (
                                  <p className="mt-[2px] text-[10px] font-medium leading-tight text-red-500">
                                    {detalle.cantidadPendiente}{' '}
                                    {detalle.cantidadPendiente === 1 ? 'pendiente' : 'pendientes'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-2 py-2.5 text-center text-[12px] text-gray-700">
                            {detalle.cantidad}
                          </td>

                          <td className="whitespace-nowrap px-2 py-2.5 text-right text-[12px] text-gray-700">
                            {formatearMoneda(detalle.precioUnitario)}
                          </td>

                          <td className="whitespace-nowrap px-3 py-2.5 text-right text-[12px] font-medium text-gray-900">
                            {formatearMoneda(detalle.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
