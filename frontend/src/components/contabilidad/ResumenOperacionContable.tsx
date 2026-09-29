import {
  BadgeDollarSign,
  CircleUserRound,
  PackageSearch,
  ReceiptText,
  Scale,
  WalletCards,
} from 'lucide-react';

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
    maximumFractionDigits: 2,
  }).format(valor);

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha));

export default function ResumenOperacionContable({ operacion }: ResumenOperacionContableProps) {
  if (operacion.tipo === 'VENTA') {
    return <ResumenVenta venta={operacion} />;
  }

  if (operacion.tipo === 'MOVIMIENTO_FINANCIERO') {
    return <ResumenMovimiento movimiento={operacion} />;
  }

  return <ResumenConciliacion conciliacion={operacion} />;
}

/* -------------------------------------------------------------------------- */
/*                                   VENTA                                    */
/* -------------------------------------------------------------------------- */

function ResumenVenta({ venta }: { venta: DetallePendienteVenta }) {
  return (
    <section className="rounded-xl bg-white p-3 shadow-md">
      {/* Encabezado */}
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2 px-1">
        <h2 className="text-xs font-semibold text-gray-900">Resumen de la operación</h2>

        <EtiquetaOrigen texto="Origen: Venta" />

        <div className="flex items-center gap-1.5 text-xs text-gray-700">
          <CircleUserRound className="h-4 w-4 text-[#668663]" />

          <span className="font-medium">Cliente</span>

          <span className="mx-1 h-5 w-px bg-gray-300" />

          <span className="font-medium text-gray-900">{venta.clienteNombre}</span>

          {venta.clienteMail && (
            <span className="hidden text-[10px] text-gray-400 md:inline">
              • {venta.clienteMail}
            </span>
          )}
        </div>
      </div>

      {/* Grilla principal */}
      <div className="grid gap-2 lg:grid-cols-2">
        {/* Datos principales */}
        <BloqueResumen>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            <Dato
              label="N° de venta"
              valor={`VEN-${String(venta.idVenta).padStart(4, '0')}`}
              destacadoVerde
            />

            <Dato
              label="Pedido asociado"
              valor={`PED-${String(venta.pedidoId).padStart(4, '0')}`}
              destacadoVerde
            />

            <Dato label="Fecha" valor={formatearFecha(venta.fecha)} />

            <Dato label="Estado" valor={venta.estado} tipo="estado" />
          </div>
        </BloqueResumen>

        {/* Productos */}
        <BloqueResumen titulo="Productos" icono={<PackageSearch className="h-4 w-4" />}>
          {venta.productos && venta.productos.length > 0 ? (
            <div className="space-y-0.5">
              <div className="grid grid-cols-[1fr_60px_100px] gap-2 text-[10px] font-medium text-gray-700">
                <span />
                <span className="text-center">Cant.</span>
                <span className="text-right">Precio unitario</span>
              </div>

              {venta.productos.map((producto) => (
                <div
                  key={producto.productoId}
                  className="grid grid-cols-[1fr_60px_100px] gap-2 text-[10px] text-gray-800"
                >
                  <span className="truncate">{producto.nombre}</span>

                  <span className="text-center">{producto.cantidad}u.</span>

                  <span className="text-right">
                    {formatearMoneda(producto.precioUnitarioCosto)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-2 text-[10px] text-gray-500">
              El detalle de productos no corresponde para esta operación.
            </p>
          )}
        </BloqueResumen>

        {/* Condiciones comerciales */}
        <BloqueResumen titulo="Condiciones comerciales" icono={<WalletCards className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5">
            <Dato label="Forma de pago" valor={venta.formaPago} />

            <Dato
              label="Descuento / Recargo"
              valor={venta.aplicaAjuste ? `${venta.tipoAjuste} ${venta.porcentajeAjuste}%` : '-'}
            />

            <Dato
              label="IVA"
              valor={venta.aplicaIva ? 'Aplicado' : 'No aplica'}
              destacadoVerde={venta.aplicaIva}
            />

            <Dato
              label="Cuotas"
              valor={venta.cantidadCuotas !== null ? String(venta.cantidadCuotas) : 'No aplica'}
            />

            <Dato
              label="Interés cuota"
              valor={venta.porcentajeInteres > 0 ? `${venta.porcentajeInteres}%` : '-'}
            />
          </div>
        </BloqueResumen>

        {/* Totales */}
        <BloqueResumen titulo="Totales" icono={<ReceiptText className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-4">
            <Dato label="Subtotal" valor={formatearMoneda(venta.subtotal)} destacadoVerde />

            <Dato
              label="IVA"
              valor={venta.aplicaIva ? formatearMoneda(venta.importeIva) : formatearMoneda(0)}
              destacadoVerde
            />

            <Dato label="Total final" valor={formatearMoneda(venta.totalFinal)} destacadoVerde />
          </div>
        </BloqueResumen>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                          MOVIMIENTO FINANCIERO                              */
/* -------------------------------------------------------------------------- */

function ResumenMovimiento({ movimiento }: { movimiento: DetallePendienteMovimiento }) {
  return (
    <section className="rounded-xl bg-white p-3 shadow-md">
      {/* Encabezado */}
      <div className="mb-2 flex flex-wrap items-center gap-3 px-1">
        <h2 className="text-xs font-semibold text-gray-900">Resumen de la operación</h2>

        <EtiquetaOrigen texto="Origen: Movimiento financiero" />
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        {/* Datos principales */}
        <BloqueResumen titulo="Movimiento" icono={<BadgeDollarSign className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
            <Dato label="Movimiento N°" valor={movimiento.idMovimiento} destacadoVerde />

            <Dato label="Fecha" valor={formatearFecha(movimiento.fecha)} />

            <Dato label="Tipo" valor={movimiento.tipoMovimiento} />

            <Dato label="Categoría" valor={movimiento.categoria} />
          </div>
        </BloqueResumen>

        {/* Datos financieros */}
        <BloqueResumen titulo="Datos financieros" icono={<WalletCards className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <Dato label="Medio de pago" valor={movimiento.medioPago} />

            <Dato label="Importe" valor={formatearMoneda(movimiento.importe)} destacadoVerde />
          </div>
        </BloqueResumen>

        {/* Concepto */}
        <div className="lg:col-span-2">
          <BloqueResumen>
            <Dato label="Concepto" valor={movimiento.concepto} />
          </BloqueResumen>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CONCILIACIÓN                                  */
/* -------------------------------------------------------------------------- */

function ResumenConciliacion({ conciliacion }: { conciliacion: DetallePendienteConciliacion }) {
  const hayFaltante = conciliacion.diferencia < 0;

  return (
    <section className="rounded-xl bg-white p-3 shadow-md">
      {/* Encabezado */}
      <div className="mb-2 flex flex-wrap items-center gap-3 px-1">
        <h2 className="text-xs font-semibold text-gray-900">Resumen de la operación</h2>

        <EtiquetaOrigen texto="Origen: Conciliación" />
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        {/* Información general */}
        <BloqueResumen titulo="Conciliación" icono={<Scale className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <Dato label="Conciliación N°" valor={conciliacion.idConciliacion} destacadoVerde />

            <Dato label="Fecha" valor={formatearFecha(conciliacion.fecha)} />
          </div>
        </BloqueResumen>

        {/* Saldos */}
        <BloqueResumen titulo="Saldos" icono={<WalletCards className="h-4 w-4" />}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            <Dato label="Saldo esperado" valor={formatearMoneda(conciliacion.saldoEsperado)} />

            <Dato label="Saldo contado" valor={formatearMoneda(conciliacion.saldoContado)} />

            <Dato
              label="Diferencia"
              valor={formatearMoneda(Math.abs(conciliacion.diferencia))}
              destacadoVerde
            />
          </div>
        </BloqueResumen>

        {/* Resultado */}
        <BloqueResumen>
          <Dato
            label="Resultado"
            valor={hayFaltante ? 'Faltante de caja' : 'Sobrante de caja'}
            destacadoVerde
          />
        </BloqueResumen>

        {/* Observación */}
        <BloqueResumen>
          <Dato label="Observación" valor={conciliacion.observacion || 'Sin observaciones'} />
        </BloqueResumen>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENTES UI                                */
/* -------------------------------------------------------------------------- */

interface BloqueResumenProps {
  titulo?: string;
  icono?: React.ReactNode;
  children: React.ReactNode;
}

function BloqueResumen({ titulo, icono, children }: BloqueResumenProps) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
      {titulo && (
        <div className="mb-2 flex items-center gap-1.5 border-b border-gray-200 pb-1.5 text-[10px] font-medium text-gray-700">
          {icono && <span className="text-[#668663]">{icono}</span>}

          <span>{titulo}</span>
        </div>
      )}

      {children}
    </div>
  );
}

function EtiquetaOrigen({ texto }: { texto: string }) {
  return (
    <span className="rounded-full bg-[#71966d] px-3 py-1 text-[10px] font-medium text-white shadow-sm">
      {texto}
    </span>
  );
}

interface DatoProps {
  label: string;
  valor: string | number;
  destacadoVerde?: boolean;
  tipo?: 'normal' | 'estado';
}

function Dato({ label, valor, destacadoVerde = false, tipo = 'normal' }: DatoProps) {
  return (
    <div className="min-w-0">
      <p className="mb-1 whitespace-nowrap text-[10px] font-medium text-gray-800">{label}</p>

      {tipo === 'estado' ? (
        <span className="inline-flex rounded-full bg-[#dcebd9] px-2 py-0.5 text-[9px] font-medium text-[#4d7049]">
          {valor}
        </span>
      ) : (
        <p
          className={[
            'truncate text-[10px] font-medium',
            destacadoVerde ? 'text-[#4d7049]' : 'text-gray-700',
          ].join(' ')}
          title={String(valor)}
        >
          {valor}
        </p>
      )}
    </div>
  );
}
