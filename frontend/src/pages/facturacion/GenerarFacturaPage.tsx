import { useState } from 'react';
import type { ReactNode } from 'react';

import { isAxiosError } from 'axios';

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  FileText,
  Home,
  Info,
  LockKeyhole,
  ReceiptText,
  ShoppingBag,
  WalletCards,
} from 'lucide-react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import FacturaModal from '../../components/facturacion/FacturaModal';

import { useDetalleVenta } from '../../hooks/useDetalleVenta';
import { useGenerarFactura } from '../../hooks/useGenerarFactura';

import type { CondicionFiscal, TipoFactura } from '../../types/facturacion.types';

import {
  formatearFecha,
  formatearMonto,
  formatearNumeroVenta,
} from '../../utils/facturacion.utils';

type CondicionFiscalFormulario = CondicionFiscal | '';
type TipoFacturaFormulario = TipoFactura | '';

function formatearNumeroPedido(idPedido: number) {
  return `PED-${String(idPedido).padStart(4, '0')}`;
}

function obtenerNombreCondicionFiscal(condicionFiscal: CondicionFiscalFormulario) {
  switch (condicionFiscal) {
    case 'RESPONSABLE_INSCRIPTO':
      return 'Responsable inscripto';

    case 'CONSUMIDOR_FINAL':
      return 'Consumidor final';

    default:
      return 'Sin seleccionar';
  }
}

function obtenerMensajeInconsistencia(
  condicionFiscal: CondicionFiscalFormulario,
  tipoFactura: TipoFacturaFormulario
) {
  if (!condicionFiscal || !tipoFactura) {
    return null;
  }

  if (condicionFiscal === 'RESPONSABLE_INSCRIPTO' && tipoFactura !== 'A') {
    return 'Para un responsable inscripto corresponde Factura A.';
  }

  if (condicionFiscal === 'CONSUMIDOR_FINAL' && tipoFactura !== 'B') {
    return 'Para un consumidor final corresponde Factura B.';
  }

  return null;
}

function obtenerMensajeError(error: unknown) {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }

  return 'No fue posible emitir la factura. Intentá nuevamente.';
}

export default function GenerarFacturaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ventaIdParam = searchParams.get('ventaId');
  const ventaId = ventaIdParam ? Number(ventaIdParam) : null;

  const ventaIdValido = ventaId !== null && Number.isInteger(ventaId) && ventaId > 0;

  const {
    data: venta,
    isLoading: cargandoVenta,
    isError: errorVenta,
  } = useDetalleVenta(ventaIdValido ? ventaId : null);

  const {
    mutate: emitirFactura,
    data: facturaGenerada,
    isPending: emitiendoFactura,
    error: errorEmision,
  } = useGenerarFactura();

  const [condicionFiscal, setCondicionFiscal] = useState<CondicionFiscalFormulario>('');

  const [tipoFactura, setTipoFactura] = useState<TipoFacturaFormulario>('');

  const mensajeInconsistencia = obtenerMensajeInconsistencia(condicionFiscal, tipoFactura);

  const formularioCompleto = condicionFiscal !== '' && tipoFactura !== '' && !mensajeInconsistencia;

  const handleEmitirFactura = () => {
    if (
      !venta ||
      !ventaIdValido ||
      ventaId === null ||
      condicionFiscal === '' ||
      tipoFactura === '' ||
      mensajeInconsistencia
    ) {
      return;
    }

    emitirFactura({
      ventaId,
      condicionFiscal,
      tipoFactura,
    });
  };

  const handleCerrarFactura = () => {
    navigate('/alumno/facturacion');
  };

  if (!ventaIdValido) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-900">No se seleccionó una venta</h2>

        <p className="mt-1 text-sm text-amber-800">
          Para generar una factura primero tenés que seleccionar una venta pendiente de facturación.
        </p>

        <button
          type="button"
          onClick={() => navigate('/alumno/facturacion/ventas-pendientes')}
          className="mt-4 cursor-pointer rounded-lg bg-abacontex-primary px-4 py-2 text-sm font-medium text-white"
        >
          Ver ventas pendientes
        </button>
      </div>
    );
  }

  if (cargandoVenta) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando información de la venta...</p>
      </div>
    );
  }

  if (errorVenta || !venta) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar la venta</h2>

        <p className="mt-1 text-sm text-red-700">
          Verificá que la venta exista y esté disponible para facturación.
        </p>

        <button
          type="button"
          onClick={() => navigate('/alumno/facturacion/ventas-pendientes')}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
        >
          Volver a ventas pendientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/alumno"
          className="flex items-center gap-1 text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4 text-abacontex-gray-text" />

        <Link
          to="/alumno/facturacion"
          className="text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          Facturación
        </Link>

        <ChevronRight className="size-4 text-abacontex-gray-text" />

        <span className="font-semibold text-abacontex-black-text">Generar factura</span>
      </nav>

      {/* Venta asociada */}
      <section className="rounded-2xl bg-white p-5 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-row gap-1 text-center">
            <LockKeyhole className="size-5 text-abacontex-black-text" />

            <h2 className="font-semibold text-abacontex-black-text">Venta asociada</h2>
          </div>

          <div className="flex items-center gap-1 text-xs text-abacontex-gray-text">
            <Info className="size-3.5" />
            Estos datos son informativos y no se pueden editar
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 cursor-not-allowed xl:grid-cols-5">
          <DatoVenta
            etiqueta="Venta"
            icono={<Building2 className="size-4" />}
            valor={formatearNumeroVenta(venta.idVenta)}
          />

          <DatoVenta
            etiqueta="Pedido"
            icono={<ShoppingBag className="size-4" />}
            valor={formatearNumeroPedido(venta.pedidoId)}
          />

          <DatoVenta
            etiqueta="Cliente"
            icono={<CircleUserRound className="size-4" />}
            valor={venta.cliente.nombre}
          />

          <DatoVenta
            etiqueta="Forma de pago"
            icono={<WalletCards className="size-4" />}
            valor={venta.condicionesComerciales.formaPago}
          />

          <DatoVenta
            etiqueta="Fecha"
            icono={<CalendarDays className="size-4" />}
            valor={formatearFecha(venta.fecha)}
          />
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-2">
        {/* Columna izquierda */}
        <div className="space-y-5">
          {/* Datos fiscales */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="font-semibold text-abacontex-black-text">Datos fiscales del cliente</h2>

            <label className="mt-4 block">
              <span className="text-xs text-abacontex-gray-text">Condición fiscal *</span>

              <div className="relative mt-1">
                <select
                  value={condicionFiscal}
                  onChange={(event) => {
                    setCondicionFiscal(event.target.value as CondicionFiscalFormulario);

                    setTipoFactura('');
                  }}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary"
                >
                  <option value="" disabled>
                    Seleccionar condición fiscal
                  </option>

                  <option value="RESPONSABLE_INSCRIPTO">Responsable inscripto</option>

                  <option value="CONSUMIDOR_FINAL">Consumidor final</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-abacontex-gray-text" />
              </div>
            </label>

            <p className="mt-2 flex items-center gap-1 text-xs text-abacontex-gray-text">
              <Info className="size-3.5" />
              Seleccioná la condición fiscal correspondiente al cliente
            </p>
          </section>

          {/* Tipo comprobante */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="font-semibold text-abacontex-black-text">Tipo de comprobante</h2>
            {condicionFiscal === '' && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                Primero seleccioná la condición fiscal del cliente.
              </p>
            )}

            <p className="mt-2 flex items-center gap-1 text-xs text-abacontex-gray-text">
              <Info className="size-3.5" />
              Elegí el tipo de factura correspondiente según su condición fiscal
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TipoFacturaCard
                tipo="A"
                seleccionado={tipoFactura === 'A'}
                disabled={condicionFiscal === ''}
                onSeleccionar={() => setTipoFactura('A')}
              />

              <TipoFacturaCard
                tipo="B"
                seleccionado={tipoFactura === 'B'}
                disabled={condicionFiscal === ''}
                onSeleccionar={() => setTipoFactura('B')}
              />
            </div>
          </section>

          {/* Inconsistencia */}
          {mensajeInconsistencia && (
            <div
              id="error-tipo-factura"
              className="flex items-start gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 shadow-sm"
            >
              <AlertTriangle className="mt-0.5 size-6 shrink-0 text-red-600" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Revisá el tipo de factura seleccionado
                </p>

                <p className="mt-1 text-sm font-medium text-red-700">{mensajeInconsistencia}</p>
              </div>
            </div>
          )}

          {/* Detalle venta */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="font-semibold text-abacontex-black-text">Detalle de la venta</h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-2xl font-sans text-sm">
                  <thead className="bg-gray-100 text-abacontex-black-text">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Producto</th>

                      <th className="px-4 py-3 text-center font-semibold">Cantidad</th>

                      <th className="px-4 py-3 text-right font-semibold">Precio de venta</th>

                      <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {venta.detalles.map((detalle) => (
                      <tr
                        key={detalle.idDetalleVenta}
                        className="border-t border-gray-200 transition-colors hover:bg-abacontex-light/60"
                      >
                        <td className="px-4 py-3 font-semibold text-abacontex-black-text">
                          {detalle.nombreProducto}
                        </td>

                        <td className="px-4 py-3 text-center font-medium text-abacontex-black-text">
                          {detalle.cantidad}
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-abacontex-black-text">
                          {formatearMonto(detalle.precioUnitario)}
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-abacontex-black-text">
                          {formatearMonto(detalle.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ml-auto mt-4 max-w-xs space-y-2">
              <FilaImporte
                etiqueta="Importe neto gravado"
                valor={formatearMonto(venta.totales.subtotal)}
              />

              {venta.condicionesComerciales.tipoAjuste !== 'NINGUNO' && (
                <FilaImporte
                  etiqueta={
                    venta.condicionesComerciales.tipoAjuste === 'DESCUENTO'
                      ? `Descuento (${venta.condicionesComerciales.porcentajeAjuste}%)`
                      : `Recargo (${venta.condicionesComerciales.porcentajeAjuste}%)`
                  }
                  valor={formatearMonto(venta.condicionesComerciales.importeAjuste)}
                />
              )}

              {venta.condicionesComerciales.importeInteres > 0 && (
                <FilaImporte
                  etiqueta={`Interés (${venta.condicionesComerciales.porcentajeInteres}%)`}
                  valor={formatearMonto(venta.condicionesComerciales.importeInteres)}
                />
              )}

              {venta.condicionesComerciales.aplicaIva && (
                <FilaImporte etiqueta="IVA 21%" valor={formatearMonto(venta.totales.importeIva)} />
              )}

              <FilaImporte
                etiqueta="Total final"
                valor={formatearMonto(venta.totales.totalFinal)}
                destacado
              />
            </div>
          </section>
        </div>

        {/* Resumen */}
        <div>
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="font-semibold text-abacontex-black-text">Resumen de la emisión</h2>

            <div className="mt-4 divide-y divide-gray-200">
              <FilaResumen
                icono={<CircleUserRound className="size-5" />}
                etiqueta="Cliente"
                valor={venta.cliente.nombre}
              />

              <FilaResumen
                icono={<FileText className="size-5" />}
                etiqueta="Condición fiscal"
                valor={obtenerNombreCondicionFiscal(condicionFiscal)}
              />

              <FilaResumen
                icono={<ReceiptText className="size-5" />}
                etiqueta="Tipo de factura"
                valor={tipoFactura ? `Factura ${tipoFactura}` : 'Sin seleccionar'}
              />

              <FilaResumen
                icono={<WalletCards className="size-5" />}
                etiqueta="Total a facturar"
                valor={formatearMonto(venta.totales.totalFinal)}
                destacado
              />
            </div>
          </section>
        </div>
      </div>

      {/* Error backend */}
      {errorEmision && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">No fue posible emitir la factura</p>

          <p className="mt-1 text-xs text-red-700">{obtenerMensajeError(errorEmision)}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => navigate('/alumno/facturacion/ventas-pendientes')}
          disabled={emitiendoFactura}
          className="cursor-pointer rounded-lg border border-gray-400 bg-white px-6 py-2 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleEmitirFactura}
          disabled={!formularioCompleto || emitiendoFactura}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-abacontex-primary-three px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileText className="size-4" />

          {emitiendoFactura ? 'Emitiendo...' : 'Emitir factura'}
        </button>
      </div>

      {/* Factura generada */}
      <FacturaModal
        abierto={Boolean(facturaGenerada)}
        factura={facturaGenerada ?? null}
        onCerrar={handleCerrarFactura}
      />
    </div>
  );
}

interface DatoVentaProps {
  etiqueta: string;
  valor: string;
  icono: ReactNode;
}

function DatoVenta({ etiqueta, valor, icono }: DatoVentaProps) {
  return (
    <div>
      <p className="text-xs font-medium text-abacontex-gray-text">{etiqueta}</p>

      <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-abacontex-black-text shadow-sm">
        <span className="text-abacontex-primary">{icono}</span>

        <span className="truncate">{valor}</span>
      </div>
    </div>
  );
}

interface TipoFacturaCardProps {
  tipo: TipoFactura;
  seleccionado: boolean;
  disabled: boolean;
  onSeleccionar: () => void;
}

function TipoFacturaCard({ tipo, seleccionado, disabled, onSeleccionar }: TipoFacturaCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSeleccionar}
      className={`flex items-center gap-4 rounded-xl border p-3 text-left transition ${
        disabled
          ? 'cursor-not-allowed border-transparent bg-gray-100 opacity-50'
          : seleccionado
            ? 'cursor-pointer border-abacontex-primary bg-abacontex-primary/10'
            : 'cursor-pointer border-transparent bg-gray-100 hover:border-gray-300'
      }`}
    >
      <span
        className={`size-4 rounded-full border ${
          seleccionado ? 'border-abacontex-primary bg-abacontex-primary' : 'border-gray-400'
        }`}
      />

      <span className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-abacontex-primary">
        {tipo}
      </span>

      <span className="font-medium text-abacontex-black-text">Factura {tipo}</span>
    </button>
  );
}

interface FilaResumenProps {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}

function FilaResumen({ icono, etiqueta, valor, destacado = false }: FilaResumenProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-abacontex-gray-text">
        {icono}

        <span className="text-sm">{etiqueta}</span>
      </div>

      <span
        className={
          destacado
            ? 'text-sm font-semibold text-abacontex-primary-three'
            : 'text-sm text-abacontex-gray-text'
        }
      >
        {valor}
      </span>
    </div>
  );
}

interface FilaImporteProps {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}

function FilaImporte({ etiqueta, valor, destacado = false }: FilaImporteProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          destacado
            ? 'font-semibold text-abacontex-black-text'
            : 'text-xs text-abacontex-black-text'
        }
      >
        {etiqueta}
      </span>

      <span
        className={
          destacado
            ? 'font-semibold text-abacontex-primary-two'
            : 'text-xs text-abacontex-black-text'
        }
      >
        {valor}
      </span>
    </div>
  );
}
