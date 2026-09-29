import { ChevronLeft, ChevronRight } from 'lucide-react';

import Button from '../ui/Button';

import type { OperacionPendiente } from '../../types/contabilidad.types';

interface TablaOperacionesPendientesProps {
  operaciones: OperacionPendiente[];
  page: number;
  totalPages: number;
  totalItems: number;
  cargando?: boolean;
  onRegistrar: (operacion: OperacionPendiente) => void;
  onCambiarPagina: (page: number) => void;
}

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha));

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);

function obtenerOrigen(operacion: OperacionPendiente) {
  switch (operacion.tipo) {
    case 'VENTA':
      return 'Venta';

    case 'MOVIMIENTO_FINANCIERO':
      return 'Movimientos financieros';

    case 'CONCILIACION_FINANCIERA':
      return 'Conciliación';
  }
}

function obtenerReferencia(operacion: OperacionPendiente) {
  switch (operacion.tipo) {
    case 'VENTA':
      return `Venta #${operacion.id}`;

    case 'MOVIMIENTO_FINANCIERO':
      return `Movimiento #${operacion.id}`;

    case 'CONCILIACION_FINANCIERA':
      return `Conciliación #${operacion.id}`;
  }
}

function obtenerClaseOrigen(operacion: OperacionPendiente) {
  switch (operacion.tipo) {
    case 'VENTA':
      return 'text-[#6A8F65]';

    case 'MOVIMIENTO_FINANCIERO':
      return 'text-[#6A8F65]';

    case 'CONCILIACION_FINANCIERA':
      return 'text-[#6A8F65]';
  }
}

function obtenerPaginasVisibles(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, '...', totalPages] as const;
  }

  if (page >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, '...', page, '...', totalPages] as const;
}

export default function TablaOperacionesPendientes({
  operaciones,
  page,
  totalPages,
  totalItems,
  cargando = false,
  onRegistrar,
  onCambiarPagina,
}: TablaOperacionesPendientesProps) {
  const inicio = totalItems === 0 ? 0 : (page - 1) * 10 + 1;
  const fin = Math.min(page * 10, totalItems);

  const paginasVisibles = obtenerPaginasVisibles(page, totalPages);

  return (
    <section
      className={['rounded-xl bg-white p-3 shadow-md', cargando ? 'opacity-70' : ''].join(' ')}
    >
      <h2 className="mb-3 text-sm font-medium text-gray-900">
        Operaciones pendientes de registrar
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-separate border-spacing-0 text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="rounded-l-xl px-4 py-2.5 text-left font-medium">Fecha</th>

              <th className="px-4 py-2.5 text-left font-medium">Origen</th>

              <th className="px-4 py-2.5 text-left font-medium">Referencia</th>

              <th className="px-4 py-2.5 text-left font-medium">Concepto</th>

              <th className="px-4 py-2.5 text-left font-medium">Importe</th>

              <th className="rounded-r-xl px-4 py-2.5 text-right font-medium">Acción</th>
            </tr>
          </thead>

          <tbody>
            {operaciones.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-500">
                  No hay operaciones pendientes de registrar.
                </td>
              </tr>
            ) : (
              operaciones.map((operacion) => (
                <tr key={`${operacion.tipo}-${operacion.id}`} className="border-b border-gray-200">
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    {formatearFecha(operacion.fecha)}
                  </td>

                  <td className="border-b border-gray-200 px-4 py-2">
                    <span
                      className={[
                        'whitespace-nowrap text-[11px] font-medium',
                        obtenerClaseOrigen(operacion),
                      ].join(' ')}
                    >
                      {obtenerOrigen(operacion)}
                    </span>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-2 text-gray-700">
                    {obtenerReferencia(operacion)}
                  </td>

                  <td className="max-w-[250px] border-b border-gray-200 px-4 py-2 text-gray-700">
                    <span className="block truncate" title={operacion.concepto}>
                      {operacion.concepto}
                    </span>
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-gray-800">
                    {formatearMoneda(operacion.montoTotal)}
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-1.5 text-right">
                    <Button
                      type="button"
                      label="Registrar asiento"
                      variant="solid"
                      onClick={() => onRegistrar(operacion)}
                      className="!rounded-md !px-3 !py-1 text-[10px] !font-medium shadow-none hover:shadow-sm"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="flex min-h-8 items-center justify-between px-4 pt-1">
          <p className="text-[10px] text-gray-400">
            Mostrando {inicio} a {fin} productos de {totalItems}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onCambiarPagina(page - 1)}
                disabled={page <= 1}
                aria-label="Página anterior"
                className="flex h-6 w-6 items-center justify-center text-gray-500 transition hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {paginasVisibles.map((pagina, index) => {
                if (pagina === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-6 min-w-6 items-center justify-center text-[10px] text-gray-600"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() => onCambiarPagina(pagina)}
                    className={[
                      'flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-medium transition',
                      pagina === page
                        ? 'bg-abacontex-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100',
                    ].join(' ')}
                  >
                    {pagina}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onCambiarPagina(page + 1)}
                disabled={page >= totalPages}
                aria-label="Página siguiente"
                className="flex h-6 w-6 items-center justify-center text-gray-500 transition hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
