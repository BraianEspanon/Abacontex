import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { OperacionPendiente } from '../../types/contabilidad.types';

interface TablaOperacionesPendientesProps {
  operaciones: OperacionPendiente[];
  page: number;
  totalPages: number;
  totalItems: number;
  cargando?: boolean;
  onRegistrar: (operacion: OperacionPendiente) => void;
  onCambiarPagina: (pagina: number) => void;
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
  }).format(valor);

function obtenerNombreOrigen(tipo: OperacionPendiente['tipo']) {
  switch (tipo) {
    case 'VENTA':
      return 'Venta';

    case 'MOVIMIENTO_FINANCIERO':
      return 'Movimiento financiero';

    case 'CONCILIACION_FINANCIERA':
      return 'Conciliación';

    default:
      return tipo;
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

    default:
      return `#${operacion.id}`;
  }
}

function obtenerClaseOrigen(tipo: OperacionPendiente['tipo']) {
  switch (tipo) {
    case 'VENTA':
      return 'bg-blue-50 text-blue-700';

    case 'MOVIMIENTO_FINANCIERO':
      return 'bg-emerald-50 text-emerald-700';

    case 'CONCILIACION_FINANCIERA':
      return 'bg-amber-50 text-amber-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
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
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-gray-900">
              Operaciones pendientes de registrar
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Operaciones que todavía no poseen un asiento contable
              asociado.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            {totalItems} {totalItems === 1 ? 'pendiente' : 'pendientes'}
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        {cargando && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="text-sm text-gray-500">
              Actualizando...
            </span>
          </div>
        )}

        <table className="w-full min-w-[950px] text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Origen</th>
              <th className="px-5 py-3">Referencia</th>
              <th className="px-5 py-3">Concepto</th>
              <th className="px-5 py-3 text-right">Importe</th>
              <th className="px-5 py-3 text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {operaciones.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No hay operaciones pendientes de registrar.
                </td>
              </tr>
            ) : (
              operaciones.map((operacion) => (
                <tr
                  key={`${operacion.tipo}-${operacion.id}`}
                  className="transition hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                    {formatearFecha(operacion.fecha)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${obtenerClaseOrigen(
                        operacion.tipo
                      )}`}
                    >
                      {obtenerNombreOrigen(operacion.tipo)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                    {obtenerReferencia(operacion)}
                  </td>

                  <td className="max-w-[300px] px-5 py-4 text-gray-600">
                    <p
                      className="truncate"
                      title={operacion.concepto}
                    >
                      {operacion.concepto}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-800">
                    {formatearMoneda(operacion.montoTotal)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onRegistrar(operacion)}
                      className="rounded-lg border border-[#6A8F65] px-3 py-2 text-xs font-semibold text-[#4E6B4A] transition hover:bg-[#eef4ec]"
                    >
                      Registrar asiento
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCambiarPagina(page - 1)}
              disabled={page <= 1 || cargando}
              aria-label="Página anterior"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#4E6B4A] px-3 text-sm font-semibold text-white">
              {page}
            </span>

            <button
              type="button"
              onClick={() => onCambiarPagina(page + 1)}
              disabled={page >= totalPages || cargando}
              aria-label="Página siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}