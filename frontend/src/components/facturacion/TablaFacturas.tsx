import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import type { FacturaListado } from '../../types/facturacion.types';

import {
  formatearFecha,
  formatearMonto,
  formatearNumeroFactura,
  formatearNumeroVenta,
} from '../../utils/facturacion.utils';

interface TablaFacturasProps {
  facturas: FacturaListado[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onVerDetalle: (idFactura: number) => void;
}

function formatearCondicionFiscal(condicionFiscal: string) {
  switch (condicionFiscal) {
    case 'RESPONSABLE_INSCRIPTO':
      return 'Responsable inscripto';

    case 'CONSUMIDOR_FINAL':
      return 'Consumidor final';

    default:
      return condicionFiscal;
  }
}

export default function TablaFacturas({
  facturas,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onVerDetalle,
}: TablaFacturasProps) {
  const primerRegistro = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const ultimoRegistro = Math.min(page * pageSize, totalItems);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white font-sans shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-4xl text-sm">
          <thead className="bg-gray-100 text-abacontex-black-text">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">N° de factura</th>

              <th className="px-4 py-3 text-left font-semibold">Venta asociada</th>

              <th className="px-4 py-3 text-center font-semibold">Cliente</th>

              <th className="px-4 py-3 text-left font-semibold">Fecha</th>

              <th className="px-4 py-3 text-center font-semibold">Tipo</th>

              <th className="px-4 py-3 text-right font-semibold">Monto total</th>

              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((factura) => (
              <tr
                key={factura.idFactura}
                className="border-t border-gray-200 transition-colors hover:bg-abacontex-light/60"
              >
                <td className="px-4 py-3 font-medium text-abacontex-primary-two">
                  {formatearNumeroFactura(factura.idFactura)}
                </td>

                <td className="px-4 py-3 font-medium text-abacontex-primary-two">
                  {formatearNumeroVenta(factura.idVenta)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col items-center text-center">
                    <span className="font-medium text-abacontex-black-text">{factura.cliente}</span>

                    <span className="mt-0.5 text-xs font-light text-abacontex-gray-text">
                      {formatearCondicionFiscal(factura.condicionFiscal)}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 font-medium text-abacontex-black-text">
                  {formatearFecha(factura.fecha)}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-green-100 font-semibold text-abacontex-primary-three">
                    {factura.tipoFactura}
                  </span>
                </td>

                <td className="px-4 py-3 text-right font-medium text-abacontex-black-text">
                  {formatearMonto(factura.montoTotal)}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onVerDetalle(factura.idFactura)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-abacontex-primary-two transition hover:text-abacontex-primary"
                  >
                    <Eye className="size-4" />
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-abacontex-gray-text">
          Mostrando {primerRegistro} a {ultimoRegistro} de {totalItems} facturas
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-sm font-medium text-abacontex-gray-text">
            Página {page} de {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}
