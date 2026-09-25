import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

import type { VentaPendienteFacturacion } from '../../types/facturacion.types';

import { formatearMonto, formatearNumeroVenta } from '../../utils/facturacion.utils';

interface TablaVentasPendientesProps {
  ventas: VentaPendienteFacturacion[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onGenerarFactura: (idVenta: number) => void;
}

export default function TablaVentasPendientes({
  ventas,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onGenerarFactura,
}: TablaVentasPendientesProps) {
  const primerRegistro = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const ultimoRegistro = Math.min(page * pageSize, totalItems);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white font-sans shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl text-sm">
          <thead className="bg-gray-100 text-abacontex-black-text">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">N° de venta</th>

              <th className="px-5 py-3 text-center font-semibold">Cliente</th>

              <th className="px-5 py-3 text-right font-semibold">Monto total</th>

              <th className="px-5 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((venta) => (
              <tr
                key={venta.idVenta}
                className="border-t border-gray-200 transition-colors hover:bg-abacontex-light/60"
              >
                <td className="px-5 py-3 font-medium text-abacontex-primary-two">
                  {formatearNumeroVenta(venta.idVenta)}
                </td>

                <td className="px-5 py-3 text-center">
                  <span className="font-medium text-abacontex-black-text">{venta.cliente}</span>
                </td>

                <td className="px-5 py-3 text-right font-medium text-abacontex-black-text">
                  {formatearMonto(venta.montoTotal)}
                </td>

                <td className="px-5 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onGenerarFactura(venta.idVenta)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-abacontex-primary-three px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-abacontex-primary-two"
                  >
                    <PlusCircle className="size-4" />
                    Generar factura
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-gray-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-abacontex-gray-text">
          Mostrando {primerRegistro} a {ultimoRegistro} de {totalItems} ventas
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
