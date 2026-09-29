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
    maximumFractionDigits: 0,
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
  }
}

export default function UltimosAsientos({ asientos, onVerLibroDiario }: UltimosAsientosProps) {
  return (
    <section className="min-h-[220px] rounded-xl bg-white p-3 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Últimos asientos registrados</h2>

        <button
          type="button"
          onClick={onVerLibroDiario}
          className="cursor-pointer text-[11px] font-medium text-[#4E6B4A] transition hover:text-[#3A5137] hover:underline"
        >
          Ver Libro Diario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-separate border-spacing-0 text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="rounded-l-xl px-4 py-2.5 text-left font-medium">N° Asiento</th>

              <th className="px-4 py-2.5 text-left font-medium">Fecha</th>

              <th className="px-4 py-2.5 text-left font-medium">Origen</th>

              <th className="px-4 py-2.5 text-left font-medium">Concepto</th>

              <th className="px-4 py-2.5 text-right font-medium">Debe</th>

              <th className="rounded-r-xl px-4 py-2.5 text-right font-medium">Haber</th>
            </tr>
          </thead>

          <tbody>
            {asientos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-xs text-gray-500">
                  Todavía no hay asientos contables registrados.
                </td>
              </tr>
            ) : (
              asientos.map((asiento) => (
                <tr key={asiento.idAsiento}>
                  <td className="border-b border-gray-200 px-4 py-2 text-center text-gray-700">
                    {asiento.numeroAsiento}
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-gray-700">
                    {formatearFecha(asiento.fechaHecho)}
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-[#6A8F65]">
                    {obtenerNombreOrigen(asiento.origen)}
                  </td>

                  <td className="max-w-[280px] border-b border-gray-200 px-4 py-2 text-gray-700">
                    <span className="block truncate" title={asiento.conceptoGeneral}>
                      {asiento.conceptoGeneral}
                    </span>
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-right text-gray-800">
                    {formatearMoneda(asiento.totalDebe)}
                  </td>

                  <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-right text-gray-800">
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
