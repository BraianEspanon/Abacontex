import type { ReactNode } from 'react';

import {
  CalendarDays,
  CircleDollarSign,
  Mail,
  MapPin,
  ReceiptText,
  Store,
  UserRound,
} from 'lucide-react';

import type { FacturaDetalle, TipoFactura } from '../../types/facturacion.types';

import { formatearFecha, formatearMonto } from '../../utils/facturacion.utils';

interface FacturaDocumentoProps {
  factura: FacturaDetalle;
}

function formatearNumeroFacturaDocumento(idFactura: number) {
  return `000-${String(idFactura).padStart(4, '0')}`;
}

function formatearCondicionFiscal(condicionFiscal: string) {
  switch (condicionFiscal) {
    case 'RESPONSABLE_INSCRIPTO':
      return 'Responsable inscripto';

    case 'CONSUMIDOR_FINAL':
      return 'Consumidor final';

    default:
      return condicionFiscal || 'No informada';
  }
}

function obtenerDescripcionTipoFactura(tipo: TipoFactura) {
  return tipo === 'A' ? 'IVA Responsable Inscripto' : 'Consumidor final';
}

export default function FacturaDocumento({ factura }: FacturaDocumentoProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white font-sans shadow-xl">
      {/* Encabezado */}
      <header className="bg-abacontex-primary px-6 py-4 text-white">
        <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-3 md:items-center">
          {/* Empresa */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <Store className="size-4.5 text-white/80" />

              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Emisor</p>
            </div>

            <h2 className="mt-1.5 font-heading text-2xl font-semibold">{factura.empresa.nombre}</h2>

            <p className="mt-1 text-xs font-medium text-white/80">
              {obtenerDescripcionTipoFactura(factura.tipoFactura)}
            </p>

            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-white/70">
              <CalendarDays className="size-3.5" />
              Inicio actividad: {formatearFecha(factura.empresa.fechaCreacion)}
            </p>
          </div>

          {/* Tipo */}
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-xl bg-white shadow-lg">
              <span className="font-heading text-6xl font-bold leading-none text-abacontex-primary">
                {factura.tipoFactura}
              </span>
            </div>
          </div>

          {/* Datos factura */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-4.5 text-white/80" />

              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                Comprobante
              </p>
            </div>

            <p className="mt-1 font-heading text-2xl font-semibold">Factura</p>

            <p className="mt-0.5 text-base font-medium">
              N° {formatearNumeroFacturaDocumento(factura.idFactura)}
            </p>

            <p className="mt-1 text-xs text-white/75">
              Emitida el {formatearFecha(factura.fechaEmision)}
            </p>
          </div>
        </div>
      </header>

      {/* Cliente */}
      <section className="border-b border-gray-200 px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <UserRound className="size-5 text-abacontex-primary" />

          <h3 className="font-semibold text-abacontex-black-text">Datos del cliente</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DatoCliente
            etiqueta="Cliente"
            valor={factura.cliente.nombre}
            icono={<UserRound className="size-4" />}
          />

          <DatoCliente
            etiqueta="Condición fiscal"
            valor={formatearCondicionFiscal(factura.cliente.condicionFiscal)}
            icono={<CircleDollarSign className="size-4" />}
          />

          <DatoCliente
            etiqueta="Localidad"
            valor={factura.cliente.localidad || 'Formosa'}
            icono={<MapPin className="size-4" />}
          />

          <DatoCliente
            etiqueta="Email"
            valor={factura.cliente.email}
            icono={<Mail className="size-4" />}
          />
        </div>

        <div className="mt-3 rounded-xl bg-abacontex-light px-4 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-abacontex-gray-text">
            Condición de venta
          </p>

          <p className="mt-0.5 text-sm font-medium text-abacontex-black-text">
            {factura.condicionVenta}
          </p>
        </div>
      </section>

      {/* Detalle */}
      <section className="px-5 py-4">
        <h3 className="mb-3 font-semibold text-abacontex-black-text">Detalle de la operación</h3>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-sm">
              <thead className="bg-abacontex-light">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-abacontex-gray-text">
                    Cantidad
                  </th>

                  <th className="px-4 py-2.5 text-left font-semibold text-abacontex-gray-text">
                    Detalle
                  </th>

                  <th className="px-4 py-2.5 text-right font-semibold text-abacontex-gray-text">
                    Precio unitario
                  </th>

                  <th className="px-4 py-2.5 text-right font-semibold text-abacontex-gray-text">
                    Importe
                  </th>
                </tr>
              </thead>

              <tbody>
                {factura.detalles.map((detalle, index) => (
                  <tr key={`${detalle.detalle}-${index}`} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 text-abacontex-black-text">{detalle.cantidad}</td>

                    <td className="px-4 py-2.5 font-medium text-abacontex-black-text">
                      {detalle.detalle}
                    </td>

                    <td className="px-4 py-2.5 text-right text-abacontex-black-text">
                      {formatearMonto(detalle.precioUnitario)}
                    </td>

                    <td className="px-4 py-2.5 text-right font-medium text-abacontex-black-text">
                      {formatearMonto(detalle.importe)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Totales + CAI */}
      <section className="grid gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4 md:grid-cols-2">
        {/* CAI */}
        <div className="rounded-xl bg-white p-3.5 shadow-sm">
          <p className="font-heading text-2xl font-semibold text-abacontex-black-text">FACTURA</p>

          <div className="mt-3 space-y-1.5">
            <DatoFiscal etiqueta="CAI" valor={factura.cai} />

            <DatoFiscal
              etiqueta="Fecha vencimiento"
              valor={formatearFecha(factura.fechaVencimiento)}
            />
          </div>
        </div>

        {/* Totales */}
        <div className="rounded-xl bg-white p-3.5 shadow-sm">
          <FilaTotal
            etiqueta={factura.tipoFactura === 'A' ? 'Neto gravado' : 'Subtotal'}
            valor={factura.totales.netoGravado}
          />

          {factura.totales.importeAjuste !== 0 && (
            <FilaTotal
              etiqueta={obtenerEtiquetaAjuste(factura)}
              valor={factura.totales.importeAjuste}
            />
          )}

          {factura.totales.importeInteres !== 0 && (
            <FilaTotal
              etiqueta={`Interés ${factura.totales.porcentajeInteres}%`}
              valor={factura.totales.importeInteres}
            />
          )}

          {factura.tipoFactura === 'A' && factura.totales.importeIva !== 0 && (
            <FilaTotal
              etiqueta={`IVA ${factura.totales.porcentajeIva}%`}
              valor={factura.totales.importeIva}
            />
          )}

          <div className="my-2 border-t border-gray-200" />

          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold uppercase tracking-wide text-abacontex-black-text">
              Total
            </span>

            <span className="text-lg font-semibold text-abacontex-primary-two">
              {formatearMonto(factura.totales.totalFinal)}
            </span>
          </div>
        </div>
      </section>
    </article>
  );
}

interface DatoClienteProps {
  etiqueta: string;
  valor: string;
  icono: ReactNode;
}

function DatoCliente({ etiqueta, valor, icono }: DatoClienteProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-abacontex-gray-text">
        {icono}

        <p className="text-xs font-medium">{etiqueta}</p>
      </div>

      <p className="mt-0.5 text-sm font-medium text-abacontex-black-text">
        {valor || 'No informado'}
      </p>
    </div>
  );
}

interface DatoFiscalProps {
  etiqueta: string;
  valor: string;
}

function DatoFiscal({ etiqueta, valor }: DatoFiscalProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-abacontex-gray-text">{etiqueta}</span>

      <span className="text-sm font-medium text-abacontex-black-text">{valor}</span>
    </div>
  );
}

interface FilaTotalProps {
  etiqueta: string;
  valor: number;
}

function FilaTotal({ etiqueta, valor }: FilaTotalProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm text-abacontex-gray-text">{etiqueta}</span>

      <span className="text-sm font-medium text-abacontex-black-text">{formatearMonto(valor)}</span>
    </div>
  );
}

function obtenerEtiquetaAjuste(factura: FacturaDetalle) {
  const { tipoAjuste, porcentajeAjuste } = factura.totales;

  if (!tipoAjuste) {
    return 'Ajuste';
  }

  const tipo =
    tipoAjuste === 'DESCUENTO' ? 'Descuento' : tipoAjuste === 'RECARGO' ? 'Recargo' : tipoAjuste;

  return porcentajeAjuste ? `${tipo} ${porcentajeAjuste}%` : tipo;
}
