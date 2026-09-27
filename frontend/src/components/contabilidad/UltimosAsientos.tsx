import { ArrowRight } from 'lucide-react';

import type { AsientoResumen } from '../../types/contabilidad.types';

interface UltimosAsientosProps {
  asientos: AsientoResumen[];
  onVerLibroDiario: () => void;
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

function obtenerNombreOrigen(origen: AsientoResumen['origen']) {
  switch (origen) {
    case 'VENTA':
      return 'Venta';

    case 'MOVIMIENTO_FINANCIERO':
      return 'Movimiento financiero';

    case 'CONCILIACION_FINANCIERA':
      return 'Conciliación';

    case 'AJUSTE':
      return 'Ajuste';

    default:
      return origen;
  }
}

export default function UltimosAsientos({ asientos, onVerLibroDiario }: UltimosAsientosProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-gray-900">Últimos asientos registrados</h2>

          <p className="mt-1 text-sm text-gray-500">
            Últimos movimientos incorporados al Libro Diario.
          </p>
        </div>

        <button
          type="button"
          onClick={onVerLibroDiario}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4E6B4A] transition hover:text-[#3A5137]"
        >
          Ver Libro Diario
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">N° Asiento</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Origen</th>
              <th className="px-5 py-3">Concepto</th>
              <th className="px-5 py-3 text-right">Debe</th>
              <th className="px-5 py-3 text-right">Haber</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {asientos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500">
                  Todavía no hay asientos contables registrados.
                </td>
              </tr>
            ) : (
              asientos.map((asiento) => (
                <tr key={asiento.idAsiento} className="transition hover:bg-gray-50/70">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                    {asiento.numeroAsiento}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {formatearFecha(asiento.fechaHecho)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {obtenerNombreOrigen(asiento.origen)}
                  </td>

                  <td className="max-w-[320px] px-5 py-4 text-gray-600">
                    <p className="truncate" title={asiento.conceptoGeneral}>
                      {asiento.conceptoGeneral}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-800">
                    {formatearMoneda(asiento.totalDebe)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-800">
                    {formatearMoneda(asiento.totalHaber)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
