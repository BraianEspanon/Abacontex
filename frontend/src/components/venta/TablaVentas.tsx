import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import type { VentaListado } from '../../types/venta.types';

interface TablaVentasProps {
  ventas: VentaListado[];

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  onPageChange: (page: number) => void;
  onVerDetalle: (idVenta: number) => void;
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
    maximumFractionDigits: 0,
  }).format(valor);
};

function generarPaginas(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

export default function TablaVentas({
  ventas,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onVerDetalle,
}: TablaVentasProps) {
  const inicio = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const fin = Math.min(page * pageSize, totalItems);

  const paginas = generarPaginas(page, totalPages);

  return (
    <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr className="text-left text-xs font-semibold text-gray-700">
              <th className="px-5 py-3">N° de venta</th>
              <th className="px-5 py-3">Pedido asociado</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Forma de pago</th>
              <th className="px-5 py-3 text-right">Monto total</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {ventas.map((venta) => (
              <tr key={venta.idVenta} className="transition hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-[#496647]">
                  VEN-{venta.idVenta.toString().padStart(4, '0')}
                </td>

                <td className="px-5 py-3 text-sm font-medium text-[#496647]">
                  PED-{venta.pedidoId.toString().padStart(5, '0')}
                </td>

                <td className="px-5 py-3 text-sm text-gray-800">{venta.cliente}</td>

                <td className="px-5 py-3 text-sm text-gray-700">{formatearFecha(venta.fecha)}</td>

                <td className="px-5 py-3 text-sm text-gray-700">{venta.metodoPago}</td>

                <td className="px-5 py-3 text-right text-sm font-medium text-gray-900">
                  {formatearMoneda(venta.montoTotal)}
                </td>

                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onVerDetalle(venta.idVenta)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-[#496647]"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex min-h-[48px] items-center justify-between border-t border-gray-200 px-5 py-2.5">
        <p className="text-xs text-gray-500">
          Mostrando {inicio} a {fin} de {totalItems} {totalItems === 1 ? 'venta' : 'ventas'}
        </p>

        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Paginación de ventas">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              aria-label="Página anterior"
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {paginas.map((pagina, index) => {
              if (pagina === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 min-w-8 items-center justify-center px-1 text-xs text-gray-500"
                  >
                    …
                  </span>
                );
              }

              const activa = pagina === page;

              return (
                <button
                  key={pagina}
                  type="button"
                  onClick={() => onPageChange(pagina)}
                  aria-current={activa ? 'page' : undefined}
                  className={[
                    'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition',
                    activa ? 'bg-[#496647] text-white' : 'text-gray-600 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {pagina}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Página siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
