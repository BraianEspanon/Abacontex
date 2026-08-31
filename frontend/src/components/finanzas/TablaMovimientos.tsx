import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

import type { MovimientoFinanciero } from '../../types/finanzas.types';

interface Props {
  movimientos: MovimientoFinanciero[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

const formatearFecha = (fecha: string) => {
  const [anio, mes, dia] = fecha.substring(0, 10).split('-');

  return `${dia}/${mes}/${anio}`;
};

function obtenerPaginasVisibles(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, page - 1, page, page + 1, totalPages];
}

export default function TablaMovimientos({
  movimientos,
  page,
  pageSize,
  totalItems,
  totalPages,
  isLoading,
  onPageChange,
}: Props) {
  if (isLoading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow-md">
        <p className="text-center text-sm text-gray-500">Cargando movimientos financieros...</p>
      </section>
    );
  }

  if (movimientos.length === 0) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-md">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Inbox size={26} className="text-gray-400" />
        </div>

        <h3 className="font-heading text-lg font-semibold text-abacontex-black-text">
          No hay movimientos para visualizar
        </h3>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          Cuando se registren ingresos o egresos, aparecerán en este historial.
        </p>
      </section>
    );
  }

  const desde = (page - 1) * pageSize + 1;
  const hasta = Math.min(page * pageSize, totalItems);

  const paginas = obtenerPaginasVisibles(page, totalPages);

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Tipo de movimiento</th>
              <th className="px-5 py-4">Categoría</th>
              <th className="px-5 py-4">Concepto</th>
              <th className="px-5 py-4">Método</th>
              <th className="px-5 py-4 text-right">Importe</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {movimientos.map((movimiento) => {
              const esIngreso = movimiento.tipoMovimiento.toUpperCase() === 'INGRESO';

              return (
                <tr key={movimiento.idMovimiento} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                    {formatearFecha(movimiento.fecha)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        esIngreso ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          esIngreso ? 'bg-green-600' : 'bg-red-500'
                        }`}
                      />

                      {esIngreso ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">{movimiento.categoria}</td>

                  <td className="px-5 py-4 text-sm text-gray-700">{movimiento.concepto}</td>

                  <td className="px-5 py-4 text-sm text-gray-700">{movimiento.metodoPago}</td>

                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right text-sm font-semibold ${
                      esIngreso ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {esIngreso ? '+' : '-'}
                    {formatearMoneda(movimiento.importe)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          Mostrando {desde} a {hasta} de {totalItems} movimientos
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {paginas.map((numeroPagina, index) => {
            const anterior = paginas[index - 1];

            const mostrarSeparador =
              index > 0 && anterior !== undefined && numeroPagina - anterior > 1;

            return (
              <div key={numeroPagina} className="flex items-center gap-1">
                {mostrarSeparador && <span className="px-1 text-sm text-gray-400">...</span>}

                <button
                  type="button"
                  onClick={() => onPageChange(numeroPagina)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                    page === numeroPagina
                      ? 'bg-abacontex-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {numeroPagina}
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </section>
  );
}
