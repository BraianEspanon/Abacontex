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
    <section className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="max-h-[570px] min-h-[570px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          {/* Encabezado */}
          <thead className="sticky top-0 z-10 bg-gray-200 font-semibold text-gray-900">
            <tr>
              <th className="w-[130px] border-r border-gray-300 px-4 py-3 text-center">Fecha</th>

              <th className="border-r border-gray-300 px-4 py-3 text-center">Concepto</th>

              <th className="w-[110px] border-r border-gray-300 px-4 py-3 text-center">N° Folio</th>

              <th className="w-[150px] border-r border-gray-300 px-4 py-3 text-center">Debe</th>

              <th className="w-[150px] px-4 py-3 text-center">Haber</th>

              {/* Columna de edición */}
              <th className="w-[70px] bg-white" />
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

          {/* Totales generales */}
          {asientos.length > 0 && (
            <tfoot>
              <tr>
                <td className="border-r border-gray-300" />

                <td className="border-r border-gray-300" />

                <td className="border-r border-gray-300" />

                <td className="border-r border-gray-300 px-3 pb-3 pt-5">
                  <div className="border-t border-gray-300 pt-3 text-center font-bold text-gray-900">
                    {formatearMoneda(totalDebe)}
                  </div>
                </td>

                <td className="px-3 pb-3 pt-5">
                  <div className="border-t border-gray-300 pt-3 text-center font-bold text-gray-900">
                    {formatearMoneda(totalHaber)}
                  </div>
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
      {/* Separador + número del asiento */}
      <tr>
        {/* Fecha */}
        <td
          rowSpan={asiento.detalles.length + 2}
          className="border-r border-gray-300 px-4 pt-3 text-center align-top font-medium text-gray-900"
        >
          {formatearFecha(asiento.fechaHecho)}
        </td>

        {/* Línea horizontal con número de asiento */}
        <td className="border-r border-gray-300 px-3 pt-3">
          <div className="flex items-center">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="shrink-0 px-4 font-semibold text-gray-900">
              {asiento.numeroAsiento}
            </span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>
        </td>

        {/* Folio */}
        <td rowSpan={asiento.detalles.length + 2} className="border-r border-gray-300 align-top">
          <div className="pt-[52px]">
            {asiento.detalles.map((detalle) => (
              <div
                key={detalle.idDetalle}
                className="flex h-7 items-center justify-center text-gray-900"
              >
                {detalle.numeroFolio ?? '—'}
              </div>
            ))}
          </div>
        </td>

        {/* Debe */}
        <td rowSpan={asiento.detalles.length + 2} className="border-r border-gray-300 align-top">
          <div className="pt-[52px]">
            {asiento.detalles.map((detalle) => (
              <div
                key={detalle.idDetalle}
                className="flex h-7 items-center justify-center text-gray-900"
              >
                {detalle.debe > 0 ? formatearMoneda(detalle.debe) : ''}
              </div>
            ))}
          </div>
        </td>

        {/* Haber */}
        <td rowSpan={asiento.detalles.length + 2} className="align-top">
          <div className="pt-[52px]">
            {asiento.detalles.map((detalle) => (
              <div
                key={detalle.idDetalle}
                className="flex h-7 items-center justify-center text-gray-900"
              >
                {detalle.haber > 0 ? formatearMoneda(detalle.haber) : ''}
              </div>
            ))}
          </div>
        </td>

        {/* Acción editar */}
        <td rowSpan={asiento.detalles.length + 2} className="px-3 pt-3 text-center align-top">
          <button
            type="button"
            onClick={() => onEditar(asiento.idAsiento)}
            title={`Editar asiento N° ${asiento.numeroAsiento}`}
            aria-label={`Editar asiento N° ${asiento.numeroAsiento}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-[#eef4ec] hover:text-[#4E6B4A]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </td>
      </tr>

      {/* Concepto general */}
      <tr>
        <td className="border-r border-gray-300 px-3 pb-0.5">
          <span
            className="block truncate font-semibold text-gray-900"
            title={asiento.conceptoGeneral}
          >
            {asiento.conceptoGeneral}
          </span>
        </td>
      </tr>

      {/* Renglones contables */}
      {asiento.detalles.map((detalle) => {
        const vaEnHaber = detalle.haber > 0;

        return (
          <tr key={detalle.idDetalle}>
            <td className="border-r border-gray-300 px-3 py-0.5">
              <div
                className={[
                  'flex h-7 items-center',
                  vaEnHaber ? 'justify-end pr-[8%]' : 'justify-start',
                ].join(' ')}
              >
                <div className="flex w-[42%] min-w-0 items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-gray-900" title={detalle.nombreCuenta}>
                    {detalle.nombreCuenta}
                  </span>

                  <span className="shrink-0 font-medium text-gray-900">
                    {detalle.movimientoAbreviatura}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}
