import type {
  DetalleOperacionPendiente,
  DetallePendienteConciliacion,
  DetallePendienteMovimiento,
  DetallePendienteVenta,
} from '../../types/contabilidad.types';

interface ResumenOperacionContableProps {
  operacion: DetalleOperacionPendiente;
}

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(valor);

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha));

export default function ResumenOperacionContable({
  operacion,
}: ResumenOperacionContableProps) {
  if (operacion.tipo === 'VENTA') {
    return <ResumenVenta venta={operacion} />;
  }

  if (operacion.tipo === 'MOVIMIENTO_FINANCIERO') {
    return <ResumenMovimiento movimiento={operacion} />;
  }

  return <ResumenConciliacion conciliacion={operacion} />;
}

function ResumenVenta({ venta }: { venta: DetallePendienteVenta }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Resumen de la operación
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Información correspondiente a la venta que se va a contabilizar.
            </p>
          </div>

          <span className="rounded-full bg-[#eef4ec] px-3 py-1 text-xs font-semibold text-[#496647]">
            Venta
          </span>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Dato label="Cliente" valor={venta.clienteNombre} />
          <Dato label="Venta N°" valor={venta.idVenta} />
          <Dato label="Pedido asociado" valor={`#${venta.pedidoId}`} />
          <Dato label="Fecha" valor={formatearFecha(venta.fecha)} />
        </div>

        {venta.productos && venta.productos.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              Productos
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3 text-center">Cantidad</th>
                    <th className="px-4 py-3 text-right">Precio unitario</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {venta.productos.map((producto) => (
                    <tr key={producto.productoId}>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {producto.nombre}
                      </td>

                      <td className="px-4 py-3 text-center text-gray-600">
                        {producto.cantidad}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatearMoneda(producto.precioUnitarioCosto)}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatearMoneda(
                          producto.cantidad * producto.precioUnitarioCosto
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-800">
            Condiciones comerciales
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Dato label="Forma de pago" valor={venta.formaPago} />

            <Dato
              label="Ajuste"
              valor={
                venta.aplicaAjuste
                  ? `${venta.tipoAjuste} (${venta.porcentajeAjuste}%)`
                  : 'Sin ajuste'
              }
            />

            <Dato
              label="IVA"
              valor={
                venta.aplicaIva
                  ? formatearMoneda(venta.importeIva)
                  : 'No aplica'
              }
            />

            <Dato
              label="Cuotas"
              valor={
                venta.cantidadCuotas !== null
                  ? `${venta.cantidadCuotas}`
                  : 'No aplica'
              }
            />
          </div>
        </div>

        <div className="ml-auto w-full max-w-sm space-y-2 border-t border-gray-200 pt-4">
          <FilaTotal label="Subtotal" valor={venta.subtotal} />

          {venta.aplicaAjuste && (
            <FilaTotal
              label={venta.tipoAjuste || 'Ajuste'}
              valor={venta.importeAjuste}
            />
          )}

          {venta.aplicaIva && (
            <FilaTotal label="IVA" valor={venta.importeIva} />
          )}

          {venta.importeInteres > 0 && (
            <FilaTotal label="Interés" valor={venta.importeInteres} />
          )}

          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold text-gray-900">Total</span>

            <span className="text-lg font-bold text-gray-900">
              {formatearMoneda(venta.totalFinal)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumenMovimiento({
  movimiento,
}: {
  movimiento: DetallePendienteMovimiento;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Resumen de la operación
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Información del movimiento financiero que se va a contabilizar.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Movimiento financiero
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Dato label="Movimiento N°" valor={movimiento.idMovimiento} />
          <Dato label="Fecha" valor={formatearFecha(movimiento.fecha)} />
          <Dato label="Tipo" valor={movimiento.tipoMovimiento} />
          <Dato label="Categoría" valor={movimiento.categoria} />
          <Dato label="Medio de pago" valor={movimiento.medioPago} />
          <Dato
            label="Importe"
            valor={formatearMoneda(movimiento.importe)}
            destacado
          />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <Dato label="Concepto" valor={movimiento.concepto} />
        </div>
      </div>
    </section>
  );
}

function ResumenConciliacion({
  conciliacion,
}: {
  conciliacion: DetallePendienteConciliacion;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Resumen de la operación
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Información de la conciliación financiera que se va a contabilizar.
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Conciliación
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Dato
            label="Conciliación N°"
            valor={conciliacion.idConciliacion}
          />

          <Dato
            label="Fecha"
            valor={formatearFecha(conciliacion.fecha)}
          />

          <Dato
            label="Saldo esperado"
            valor={formatearMoneda(conciliacion.saldoEsperado)}
          />

          <Dato
            label="Saldo contado"
            valor={formatearMoneda(conciliacion.saldoContado)}
          />
        </div>

        <div className="mt-5 grid gap-5 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <Dato
            label="Diferencia"
            valor={formatearMoneda(conciliacion.diferencia)}
            destacado
          />

          <Dato
            label="Observación"
            valor={conciliacion.observacion || 'Sin observaciones'}
          />
        </div>
      </div>
    </section>
  );
}

interface DatoProps {
  label: string;
  valor: string | number;
  destacado?: boolean;
}

function Dato({ label, valor, destacado = false }: DatoProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p
        className={[
          'mt-1 text-sm',
          destacado
            ? 'font-semibold text-gray-900'
            : 'font-medium text-gray-800',
        ].join(' ')}
      >
        {valor}
      </p>
    </div>
  );
}

function FilaTotal({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">
        {formatearMoneda(valor)}
      </span>
    </div>
  );
}