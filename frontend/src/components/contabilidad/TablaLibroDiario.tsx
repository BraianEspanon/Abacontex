import { Pencil } from 'lucide-react';

import type { AsientoLibroDiario } from '../../types/contabilidad.types';

interface TablaLibroDiarioProps {
  asientos: AsientoLibroDiario[];
  totalDebe: number;
  totalHaber: number;
  onEditar: (idAsiento: number) => void;
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

export default function TablaLibroDiario({
  asientos,
  totalDebe,
  totalHaber,
  onEditar,
}: TablaLibroDiarioProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Libro Diario</h2>

        <p className="mt-1 text-sm text-gray-500">Asientos contables registrados por la empresa.</p>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-[130px] px-5 py-3">Fecha</th>

              <th className="px-5 py-3">Concepto</th>

              <th className="w-[120px] px-5 py-3 text-center">N° Folio</th>

              <th className="w-[150px] px-5 py-3 text-right">Debe</th>

              <th className="w-[150px] px-5 py-3 text-right">Haber</th>

              <th className="w-[70px] px-5 py-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody>
            {asientos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  Todavía no hay asientos contables registrados.
                </td>
              </tr>
            ) : (
              asientos.map((asiento) => (
                <AsientoDiario key={asiento.idAsiento} asiento={asiento} onEditar={onEditar} />
              ))
            )}
          </tbody>

          {asientos.length > 0 && (
            <tfoot className="sticky bottom-0 border-t-2 border-gray-300 bg-white">
              <tr>
                <td colSpan={3} className="px-5 py-4 text-right font-semibold text-gray-800">
                  Totales
                </td>

                <td className="px-5 py-4 text-right font-bold text-gray-900">
                  {formatearMoneda(totalDebe)}
                </td>

                <td className="px-5 py-4 text-right font-bold text-gray-900">
                  {formatearMoneda(totalHaber)}
                </td>

                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}

interface AsientoDiarioProps {
  asiento: AsientoLibroDiario;
  onEditar: (idAsiento: number) => void;
}

function AsientoDiario({ asiento, onEditar }: AsientoDiarioProps) {
  return (
    <>
      {/* Encabezado del asiento */}
      <tr className="border-t border-gray-200 bg-gray-50/60">
        <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-700">
          {formatearFecha(asiento.fechaHecho)}
        </td>

        <td colSpan={4} className="px-5 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-gray-900">Asiento N° {asiento.numeroAsiento}</span>

            <span className="text-gray-600">{asiento.conceptoGeneral}</span>
          </div>
        </td>

        <td className="px-5 py-3 text-center">
          <button
            type="button"
            onClick={() => onEditar(asiento.idAsiento)}
            title={`Editar asiento N° ${asiento.numeroAsiento}`}
            aria-label={`Editar asiento N° ${asiento.numeroAsiento}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#eef4ec] hover:text-[#4E6B4A]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </td>
      </tr>

      {/* Renglones del asiento */}
      {asiento.detalles.map((detalle, index) => (
        <tr
          key={detalle.idDetalle}
          className={index === asiento.detalles.length - 1 ? 'border-b border-gray-200' : ''}
        >
          <td className="px-5 py-3" />

          <td className="px-5 py-3 text-gray-700">
            <div className="flex items-center gap-2">
              <span>{detalle.nombreCuenta}</span>

              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {detalle.movimientoAbreviatura}
              </span>
            </div>
          </td>

          <td className="px-5 py-3 text-center text-gray-600">{detalle.numeroFolio ?? '—'}</td>

          <td className="px-5 py-3 text-right text-gray-800">
            {detalle.debe > 0 ? formatearMoneda(detalle.debe) : '—'}
          </td>

          <td className="px-5 py-3 text-right text-gray-800">
            {detalle.haber > 0 ? formatearMoneda(detalle.haber) : '—'}
          </td>

          <td />
        </tr>
      ))}
    </>
  );
}
