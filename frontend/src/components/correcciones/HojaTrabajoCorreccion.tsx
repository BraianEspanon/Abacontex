import { AlertTriangle } from 'lucide-react';

import type {
  ContenidoHojaTrabajo,
  FilaHojaTrabajo,
  ResultadoEjercicioHojaTrabajo,
} from '../../types/ejercicio.types';

import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface HojaTrabajoCorreccionProps {
  contenido: ContenidoHojaTrabajo;
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (error: ErrorDetalleCorreccion) => void;
}

const COLUMNAS = [
  {
    grupo: 'saldosSinAjustar',
    titulo: 'Saldos sin ajustar',
    campos: [
      { clave: 'deudor', titulo: 'Deudor' },
      { clave: 'acreedor', titulo: 'Acreedor' },
    ],
  },
  {
    grupo: 'ajustes',
    titulo: 'Ajustes',
    campos: [
      { clave: 'debe', titulo: 'Debe' },
      { clave: 'haber', titulo: 'Haber' },
    ],
  },
  {
    grupo: 'saldosAjustados',
    titulo: 'Saldos ajustados',
    campos: [
      { clave: 'deudor', titulo: 'Deudor' },
      { clave: 'acreedor', titulo: 'Acreedor' },
    ],
  },
  {
    grupo: 'estadoPatrimonial',
    titulo: 'Estado patrimonial',
    campos: [
      { clave: 'activo', titulo: 'Activo' },
      { clave: 'pasivoMasPn', titulo: 'Pasivo + PN' },
    ],
  },
  {
    grupo: 'estadoResultados',
    titulo: 'Estado de resultados',
    campos: [
      { clave: 'negativo', titulo: 'Negativo' },
      { clave: 'positivo', titulo: 'Positivo' },
    ],
  },
] as const;

type GrupoColumna = (typeof COLUMNAS)[number]['grupo'];

type CampoResultado = keyof ResultadoEjercicioHojaTrabajo;

const CAMPOS_RESULTADO: CampoResultado[] = ['activo', 'pasivoMasPn', 'negativo', 'positivo'];

function formatearImporte(valor: number): string {
  if (valor === 0) return '-';

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function obtenerNumero(valor: unknown): number {
  const numero = Number(valor ?? 0);
  return Number.isFinite(numero) ? numero : 0;
}

function obtenerRegistro(valor: unknown): Record<string, unknown> | null {
  if (valor === null || typeof valor !== 'object' || Array.isArray(valor)) {
    return null;
  }

  return valor as Record<string, unknown>;
}

function obtenerImporteFila(fila: FilaHojaTrabajo, grupo: GrupoColumna, campo: string): number {
  const datos = obtenerRegistro(fila[grupo]);
  return obtenerNumero(datos?.[campo]);
}

function obtenerErroresFila(
  errores: ErrorDetalleCorreccion[],
  idCuenta: number
): ErrorDetalleCorreccion[] {
  return errores.filter((error) => Number(error.detalle.idCuenta) === idCuenta);
}

function obtenerErrorCelda(
  erroresFila: ErrorDetalleCorreccion[],
  grupo: GrupoColumna,
  campo: string
): ErrorDetalleCorreccion | undefined {
  return erroresFila.find((error) => {
    const detalle = error.detalle;

    if (detalle.columna !== grupo) return false;

    const esperado = obtenerRegistro(detalle.esperado);
    const obtenido = obtenerRegistro(detalle.obtenido);

    if (esperado && obtenido) {
      return Math.abs(obtenerNumero(esperado[campo]) - obtenerNumero(obtenido[campo])) > 0.01;
    }

    return detalle.celda === campo;
  });
}

function obtenerErrorResultado(
  errores: ErrorDetalleCorreccion[],
  campo: CampoResultado
): ErrorDetalleCorreccion | undefined {
  return errores.find((error) => {
    if (error.detalle.celda !== 'resultadoDelEjercicio') {
      return false;
    }

    const esperado = obtenerRegistro(error.detalle.esperado);
    const obtenido = obtenerRegistro(error.detalle.obtenido);

    if (!esperado || !obtenido) {
      return true;
    }

    return Math.abs(obtenerNumero(esperado[campo]) - obtenerNumero(obtenido[campo])) > 0.01;
  });
}

function calcularTotales(filas: FilaHojaTrabajo[]): Record<string, number> {
  const totales: Record<string, number> = {};

  for (const grupo of COLUMNAS) {
    for (const campo of grupo.campos) {
      const clave = `${grupo.grupo}.${campo.clave}`;

      totales[clave] = filas.reduce(
        (acumulado, fila) => acumulado + obtenerImporteFila(fila, grupo.grupo, campo.clave),
        0
      );
    }
  }

  return totales;
}

interface CeldaImporteProps {
  valor: number;
  error?: ErrorDetalleCorreccion;
  onSeleccionarError: (error: ErrorDetalleCorreccion) => void;
  separador?: boolean;
}

function CeldaImporte({ valor, error, onSeleccionarError, separador = false }: CeldaImporteProps) {
  return (
    <td
      className={`border-b border-gray-100 px-1 py-1.5 ${
        separador ? 'border-r border-gray-200' : ''
      }`}
    >
      {error ? (
        <button
          type="button"
          onClick={() => onSeleccionarError(error)}
          title="Ver detalle del error"
          className="flex min-h-7 w-full items-center justify-between gap-1 rounded border border-red-300 bg-red-50 px-1.5 py-1 text-right text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <span className="ml-auto">{formatearImporte(valor)}</span>

          <AlertTriangle size={12} className="shrink-0" />
        </button>
      ) : (
        <div className="px-1.5 py-1 text-right text-[11px] text-gray-700">
          {formatearImporte(valor)}
        </div>
      )}
    </td>
  );
}

export default function HojaTrabajoCorreccion({
  contenido,
  errores,
  onSeleccionarError,
}: HojaTrabajoCorreccionProps) {
  const filas = contenido?.filas ?? [];

  const totales = calcularTotales(filas);

  const resultado = contenido?.resultadoDelEjercicio;

  const erroresPorCuenta = errores.filter(
    (error) => error.tipoError === 'CUENTA_ADICIONAL' || error.tipoError === 'CUENTA_OMITIDA'
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Hoja de Trabajo</h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            Balance de 10 columnas presentado por el alumno.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Diferencia detectada
          </span>

          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            Sin diferencia señalada
          </span>
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            El alumno no registró cuentas en la Hoja de Trabajo.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] table-fixed border-collapse text-[11px]">
              <colgroup>
                <col className="w-[38px]" />
                <col className="w-[210px]" />

                {COLUMNAS.flatMap((grupo) =>
                  grupo.campos.map((campo) => (
                    <col key={`${grupo.grupo}.${campo.clave}`} className="w-[100px]" />
                  ))
                )}
              </colgroup>

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                  <th
                    rowSpan={2}
                    className="border-r border-gray-200 px-1 py-2 text-center font-semibold"
                  >
                    N°
                  </th>

                  <th
                    rowSpan={2}
                    className="border-r border-gray-200 px-2 py-2 text-left font-semibold"
                  >
                    Cuentas
                  </th>

                  {COLUMNAS.map((grupo) => (
                    <th
                      key={grupo.grupo}
                      colSpan={2}
                      className="border-r border-gray-200 px-1 py-2 text-center font-semibold"
                    >
                      {grupo.titulo}
                    </th>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-500">
                  {COLUMNAS.flatMap((grupo) =>
                    grupo.campos.map((campo, indice) => (
                      <th
                        key={`${grupo.grupo}.${campo.clave}`}
                        className={`px-1 py-1.5 text-center font-medium ${
                          indice === 1 ? 'border-r border-gray-200' : ''
                        }`}
                      >
                        {campo.titulo}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {filas.map((fila, indiceFila) => {
                  const erroresFila = obtenerErroresFila(errores, fila.idCuenta);

                  const errorCuentaAdicional = erroresFila.find(
                    (error) => error.tipoError === 'CUENTA_ADICIONAL'
                  );

                  return (
                    <tr key={`${fila.idCuenta}-${indiceFila}`} className="hover:bg-gray-50/50">
                      <td className="border-b border-r border-gray-100 px-1 py-2 text-center text-gray-500">
                        {indiceFila + 1}
                      </td>

                      <td className="border-b border-r border-gray-100 px-2 py-1.5">
                        {errorCuentaAdicional ? (
                          <button
                            type="button"
                            onClick={() => onSeleccionarError(errorCuentaAdicional)}
                            className="flex w-full items-center justify-between gap-1 rounded border border-red-300 bg-red-50 px-2 py-1.5 text-left text-[11px] font-semibold text-red-600 hover:bg-red-100"
                          >
                            <span className="truncate">{fila.cuenta}</span>

                            <AlertTriangle size={12} className="shrink-0" />
                          </button>
                        ) : (
                          <div className="truncate px-1 py-1 font-medium text-gray-800">
                            {fila.cuenta}
                          </div>
                        )}
                      </td>

                      {COLUMNAS.flatMap((grupo) =>
                        grupo.campos.map((campo, indice) => {
                          const error = obtenerErrorCelda(erroresFila, grupo.grupo, campo.clave);

                          const valor = obtenerImporteFila(fila, grupo.grupo, campo.clave);

                          return (
                            <CeldaImporte
                              key={`${grupo.grupo}.${campo.clave}`}
                              valor={valor}
                              error={error}
                              onSeleccionarError={onSeleccionarError}
                              separador={indice === 1}
                            />
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-t border-gray-200 bg-green-50 font-semibold text-gray-800">
                  <td colSpan={2} className="border-r border-gray-200 px-2 py-2 text-center">
                    TOTALES
                  </td>

                  {COLUMNAS.flatMap((grupo) =>
                    grupo.campos.map((campo, indice) => {
                      const clave = `${grupo.grupo}.${campo.clave}`;

                      return (
                        <td
                          key={clave}
                          className={`px-2 py-2 text-right ${
                            indice === 1 ? 'border-r border-gray-200' : ''
                          }`}
                        >
                          {formatearImporte(totales[clave] ?? 0)}
                        </td>
                      );
                    })
                  )}
                </tr>

                <tr className="border-t border-gray-200 bg-white">
                  <td
                    colSpan={8}
                    className="border-r border-gray-200 px-3 py-2 text-right font-semibold text-gray-900"
                  >
                    Resultado del ejercicio
                  </td>

                  {CAMPOS_RESULTADO.map((campo, indice) => {
                    const error = obtenerErrorResultado(errores, campo);

                    const valor = obtenerNumero(resultado?.[campo]);

                    return (
                      <CeldaImporte
                        key={campo}
                        valor={valor}
                        error={error}
                        onSeleccionarError={onSeleccionarError}
                        separador={indice === 1 || indice === 3}
                      />
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-500">
        Seleccioná un campo resaltado para consultar la diferencia. Las cuentas omitidas y otros
        errores sin una celda asociada pueden consultarse en el listado de errores detectados.
      </p>

      {erroresPorCuenta.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {erroresPorCuenta.map((error, indice) => (
            <button
              key={`${error.tipoError}-${error.detalle.idCuenta}-${indice}`}
              type="button"
              onClick={() => onSeleccionarError(error)}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700 hover:bg-red-100"
            >
              <AlertTriangle size={12} />
              {error.tipoError === 'CUENTA_OMITIDA' ? 'Cuenta omitida' : 'Cuenta adicional'}:{' '}
              {String(error.detalle.cuenta ?? 'Sin nombre')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
