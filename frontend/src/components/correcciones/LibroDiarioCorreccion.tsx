import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { obtenerResaltadosLibroDiario } from './resaltadoLibroDiario';

import type { ContenidoLibroDiario } from '../../types/ejercicio.types';
import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';
import type { CampoResaltadoLibroDiario } from './resaltadoLibroDiario';

interface LibroDiarioCorreccionProps {
  contenido: ContenidoLibroDiario;
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (indiceError: number) => void;
}

const formatoImporte = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function mostrarImporte(valor: number): string {
  return formatoImporte.format(Number(valor || 0));
}

function obtenerNombreCuenta(cuenta: string): string {
  return cuenta?.trim() || 'Cuenta sin especificar';
}

export default function LibroDiarioCorreccion({
  contenido,
  errores,
  onSeleccionarError,
}: LibroDiarioCorreccionProps) {
  const resaltados = obtenerResaltadosLibroDiario(contenido, errores);

  function erroresDeCelda(
    numeroAsiento: number,
    indiceLinea: number,
    campo: CampoResaltadoLibroDiario
  ): number[] {
    return resaltados
      .filter(
        (item) =>
          item.numeroAsiento === numeroAsiento &&
          item.indiceLinea === indiceLinea &&
          item.campo === campo
      )
      .map((item) => item.indiceError);
  }

  function celda(contenidoCelda: React.ReactNode, indicesError: number[], className = '') {
    const incorrecta = indicesError.length > 0;

    return (
      <div
        className={`flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 ${
          incorrecta ? 'border border-red-300 bg-red-50 text-red-700' : 'text-gray-700'
        } ${className}`}
      >
        <span className="min-w-0 flex-1">{contenidoCelda}</span>

        {incorrecta && (
          <button
            type="button"
            onClick={() => onSeleccionarError(indicesError[0])}
            title={
              indicesError.length === 1
                ? 'Ver detalle del error'
                : `Ver detalle de ${indicesError.length} errores`
            }
            aria-label="Ver detalle del error"
            className="shrink-0 rounded p-0.5 text-red-600 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <AlertCircle size={15} />
          </button>
        )}
      </div>
    );
  }

  if (contenido.asientos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        El alumno no registró asientos en el Libro Diario.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Libro Diario</h3>
          <p className="mt-0.5 text-xs text-gray-500">Resolución presentada por el alumno</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-red-700">
            <span className="size-2.5 rounded-sm bg-red-200 ring-1 ring-red-300" />
            Diferencia detectada
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="size-2.5 rounded-sm bg-gray-200" />
            Sin diferencia señalada
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-[#e5ede4] text-xs font-semibold text-gray-700">
              <th className="w-30 px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Cuenta contable</th>
              <th className="w-26 px-3 py-3 text-center">Movimiento</th>
              <th className="w-20 px-3 py-3 text-center">Folio</th>
              <th className="w-36 px-3 py-3 text-right">Debe</th>
              <th className="w-36 px-3 py-3 text-right">Haber</th>
            </tr>
          </thead>

          {contenido.asientos.map((asiento) => {
            const totalDebe = asiento.lineas.reduce(
              (total, linea) => total + Number(linea.debe || 0),
              0
            );
            const totalHaber = asiento.lineas.reduce(
              (total, linea) => total + Number(linea.haber || 0),
              0
            );

            const balanceado =
              asiento.lineas.length > 0 &&
              asiento.lineas.some((linea) => Number(linea.debe) > 0 || Number(linea.haber) > 0) &&
              Math.abs(totalDebe - totalHaber) <= 0.01;

            const erroresAsiento = errores.filter(
              (error) => Number(error.detalle.numeroAsiento) === asiento.numero
            );

            return (
              <tbody key={asiento.numero} className="border-b-2 border-gray-200 last:border-b-0">
                <tr className="bg-gray-50/80">
                  <td colSpan={6} className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        Asiento N.º {asiento.numero}
                      </span>

                      {asiento.concepto && (
                        <span className="text-xs text-gray-500">{asiento.concepto}</span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          balanceado ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {balanceado ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        {balanceado ? 'Balanceado' : 'Sin balancear o incompleto'}
                      </span>

                      {erroresAsiento.length > 0 && (
                        <span className="ml-auto text-xs font-medium text-red-600">
                          {erroresAsiento.length}{' '}
                          {erroresAsiento.length === 1 ? 'error detectado' : 'errores detectados'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>

                {asiento.lineas.map((linea, indiceLinea) => {
                  const cuenta = erroresDeCelda(asiento.numero, indiceLinea, 'cuenta');
                  const movimiento = erroresDeCelda(asiento.numero, indiceLinea, 'movimiento');
                  const debe = erroresDeCelda(asiento.numero, indiceLinea, 'debe');
                  const haber = erroresDeCelda(asiento.numero, indiceLinea, 'haber');

                  return (
                    <tr
                      key={indiceLinea}
                      className="border-t border-gray-100 transition hover:bg-gray-50/60"
                    >
                      <td className="px-4 py-2 text-xs text-gray-600">{asiento.fecha || '—'}</td>

                      <td className="px-2 py-1.5">
                        {celda(
                          <span className="font-medium">{obtenerNombreCuenta(linea.cuenta)}</span>,
                          cuenta
                        )}
                      </td>

                      <td className="px-2 py-1.5">
                        {celda(
                          <span className="font-medium">{linea.movimiento || '—'}</span>,
                          movimiento,
                          'justify-center text-center'
                        )}
                      </td>

                      <td className="px-3 py-2 text-center text-gray-600">{linea.folio ?? '—'}</td>

                      <td className="px-2 py-1.5">
                        {celda(mostrarImporte(linea.debe), debe, 'text-right tabular-nums')}
                      </td>

                      <td className="px-2 py-1.5">
                        {celda(mostrarImporte(linea.haber), haber, 'text-right tabular-nums')}
                      </td>
                    </tr>
                  );
                })}

                {asiento.lineas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-5 text-center text-sm text-gray-500">
                      El asiento no contiene líneas contables.
                    </td>
                  </tr>
                )}

                <tr className="border-t border-gray-200 bg-gray-50/70 font-semibold text-gray-800">
                  <td colSpan={4} className="px-4 py-3 text-right text-xs">
                    Total del asiento
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${mostrarImporte(totalDebe)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${mostrarImporte(totalHaber)}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
        Seleccioná el ícono de una celda resaltada para consultar el error detectado. Las
        diferencias que no pueden asociarse a una celda se encuentran en el listado de errores.
      </div>
    </div>
  );
}
