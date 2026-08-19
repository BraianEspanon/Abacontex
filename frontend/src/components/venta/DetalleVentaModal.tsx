import { CreditCard, Mail, Package, ReceiptText, UserRound, X } from 'lucide-react';

import type { DetalleVenta } from '../../types/venta.types';

interface DetalleVentaModalProps {
  abierto: boolean;
  venta: DetalleVenta | undefined;
  cargando: boolean;
  error: boolean;
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

const nombreTipoAjuste = (tipo: DetalleVenta['condicionesComerciales']['tipoAjuste']) => {
  switch (tipo) {
    case 'DESCUENTO':
      return 'Descuento';

    case 'RECARGO':
      return 'Recargo';

    default:
      return 'Sin ajuste';
  }
};

export default function DetalleVentaModal({
  abierto,
  venta,
  cargando,
  error,
  onCerrar,
}: DetalleVentaModalProps) {
  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">Detalle de venta</h2>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cargando */}
        {cargando && (
          <div className="flex min-h-64 items-center justify-center p-6">
            <p className="text-sm text-gray-500">Cargando detalle de la venta...</p>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">No fue posible cargar la venta.</p>

              <p className="mt-1 text-sm text-red-700">Cerrá el detalle e intentá nuevamente.</p>
            </div>
          </div>
        )}

        {venta && !cargando && !error && (
          <div className="space-y-5 p-6">
            {/* Datos principales */}
            <section className="rounded-xl border border-gray-200 p-4">
              <div className="grid gap-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">N° de venta</p>

                  <p className="mt-1 font-semibold text-[#496647]">
                    VEN-{venta.idVenta.toString().padStart(4, '0')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Pedido asociado</p>

                  <p className="mt-1 font-semibold text-[#496647]">
                    PED-{venta.pedidoId.toString().padStart(5, '0')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Fecha</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatearFecha(venta.fecha)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Estado</p>

                  <span className="mt-1 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {venta.estado === 'CONFIRMADA' ? 'Confirmada' : venta.estado}
                  </span>
                </div>
              </div>
            </section>

            {/* Cliente */}
            <section className="rounded-xl border border-gray-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-[#496647]" />

                <h3 className="font-semibold text-gray-900">Cliente</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">{venta.cliente.nombre}</p>
                </div>

                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    Correo electrónico
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-800">
                    {venta.cliente.email}
                  </p>
                </div>
              </div>
            </section>

            {/* Condiciones comerciales */}
            <section className="rounded-xl border border-gray-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#496647]" />

                <h3 className="font-semibold text-gray-900">Condiciones comerciales</h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <p className="text-xs text-gray-500">Forma de pago</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {venta.condicionesComerciales.formaPago}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Descuento / Recargo</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {venta.condicionesComerciales.tipoAjuste === 'NINGUNO'
                      ? '—'
                      : `${nombreTipoAjuste(venta.condicionesComerciales.tipoAjuste)} ${
                          venta.condicionesComerciales.porcentajeAjuste
                        }%`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">IVA</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {venta.condicionesComerciales.aplicaIva ? 'Aplicado' : 'No aplicado'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Cuotas</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {venta.condicionesComerciales.cantidadCuotas ?? 'No aplica'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Interés de cuota</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {venta.condicionesComerciales.porcentajeInteres > 0
                      ? `${venta.condicionesComerciales.porcentajeInteres}%`
                      : '—'}
                  </p>
                </div>
              </div>
            </section>

            {/* Productos */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-[#496647]" />

                <h3 className="font-semibold text-gray-900">Productos vendidos</h3>
              </div>

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
                    {venta.detalles.map((detalle) => (
                      <tr key={detalle.idDetalleVenta}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {detalle.nombreProducto}
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
                </table>
              </div>
            </section>

            {/* Totales */}
            <section className="rounded-xl border border-gray-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-[#496647]" />

                <h3 className="font-semibold text-gray-900">Totales</h3>
              </div>

              <div className="space-y-3">
                <FilaTotal etiqueta="Subtotal" valor={formatearMoneda(venta.totales.subtotal)} />

                {venta.condicionesComerciales.tipoAjuste !== 'NINGUNO' && (
                  <FilaTotal
                    etiqueta={nombreTipoAjuste(venta.condicionesComerciales.tipoAjuste)}
                    valor={formatearMoneda(venta.condicionesComerciales.importeAjuste)}
                  />
                )}

                {venta.condicionesComerciales.aplicaIva && (
                  <FilaTotal
                    etiqueta="IVA (21%)"
                    valor={formatearMoneda(venta.totales.importeIva)}
                  />
                )}

                {venta.condicionesComerciales.importeInteres > 0 && (
                  <FilaTotal
                    etiqueta="Interés"
                    valor={formatearMoneda(venta.condicionesComerciales.importeInteres)}
                  />
                )}

                <div className="border-t border-gray-200 pt-3">
                  <FilaTotal
                    etiqueta="Total final"
                    valor={formatearMoneda(venta.totales.totalFinal)}
                    destacado
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCerrar}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilaTotalProps {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}

function FilaTotal({ etiqueta, valor, destacado = false }: FilaTotalProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={destacado ? 'font-semibold text-gray-900' : 'text-sm text-gray-600'}>
        {etiqueta}
      </span>

      <span
        className={
          destacado ? 'text-lg font-bold text-[#496647]' : 'text-sm font-semibold text-gray-900'
        }
      >
        {valor}
      </span>
    </div>
  );
}
