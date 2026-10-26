import { Plus, Trash2 } from 'lucide-react';

import { useCuentasContablesEjercicio } from '../../../hooks/useCuentasContablesEjercicio';
import SelectorCuentaContable from './SelectorCuentaContable';

import type {
  ContenidoHojaTrabajo,
  FilaHojaTrabajo,
  ResultadoEjercicioHojaTrabajo,
} from '../../../types/ejercicio.types';
import InputImporte from './InputImporte';

interface HojaTrabajoEditorProps {
  contenido: ContenidoHojaTrabajo;
  onChange: (contenido: ContenidoHojaTrabajo) => void;
  soloLectura?: boolean;
}

interface TotalesHojaTrabajo {
  saldosSinAjustar: {
    deudor: number;
    acreedor: number;
  };
  ajustes: {
    debe: number;
    haber: number;
  };
  saldosAjustados: {
    deudor: number;
    acreedor: number;
  };
  estadoPatrimonial: {
    activo: number;
    pasivoMasPn: number;
  };
  estadoResultados: {
    negativo: number;
    positivo: number;
  };
}

type CampoImporteFila =
  | 'saldosSinAjustar.deudor'
  | 'saldosSinAjustar.acreedor'
  | 'ajustes.debe'
  | 'ajustes.haber'
  | 'saldosAjustados.deudor'
  | 'saldosAjustados.acreedor'
  | 'estadoPatrimonial.activo'
  | 'estadoPatrimonial.pasivoMasPn'
  | 'estadoResultados.negativo'
  | 'estadoResultados.positivo';

function crearFila(): FilaHojaTrabajo {
  return {
    idCuenta: 0,
    cuenta: '',
    saldosSinAjustar: {
      deudor: 0,
      acreedor: 0,
    },
    ajustes: {
      debe: 0,
      haber: 0,
    },
    saldosAjustados: {
      deudor: 0,
      acreedor: 0,
    },
    estadoPatrimonial: {
      activo: 0,
      pasivoMasPn: 0,
    },
    estadoResultados: {
      negativo: 0,
      positivo: 0,
    },
  };
}

function redondearImporte(valor: number): number {
  return Number(valor.toFixed(2));
}

function calcularTotales(filas: FilaHojaTrabajo[]): TotalesHojaTrabajo {
  return filas.reduce<TotalesHojaTrabajo>(
    (acumulado, fila) => ({
      saldosSinAjustar: {
        deudor: redondearImporte(
          acumulado.saldosSinAjustar.deudor + (fila.saldosSinAjustar.deudor || 0)
        ),
        acreedor: redondearImporte(
          acumulado.saldosSinAjustar.acreedor + (fila.saldosSinAjustar.acreedor || 0)
        ),
      },

      ajustes: {
        debe: redondearImporte(acumulado.ajustes.debe + (fila.ajustes.debe || 0)),
        haber: redondearImporte(acumulado.ajustes.haber + (fila.ajustes.haber || 0)),
      },

      saldosAjustados: {
        deudor: redondearImporte(
          acumulado.saldosAjustados.deudor + (fila.saldosAjustados.deudor || 0)
        ),
        acreedor: redondearImporte(
          acumulado.saldosAjustados.acreedor + (fila.saldosAjustados.acreedor || 0)
        ),
      },

      estadoPatrimonial: {
        activo: redondearImporte(
          acumulado.estadoPatrimonial.activo + (fila.estadoPatrimonial.activo || 0)
        ),
        pasivoMasPn: redondearImporte(
          acumulado.estadoPatrimonial.pasivoMasPn + (fila.estadoPatrimonial.pasivoMasPn || 0)
        ),
      },

      estadoResultados: {
        negativo: redondearImporte(
          acumulado.estadoResultados.negativo + (fila.estadoResultados.negativo || 0)
        ),
        positivo: redondearImporte(
          acumulado.estadoResultados.positivo + (fila.estadoResultados.positivo || 0)
        ),
      },
    }),
    {
      saldosSinAjustar: {
        deudor: 0,
        acreedor: 0,
      },
      ajustes: {
        debe: 0,
        haber: 0,
      },
      saldosAjustados: {
        deudor: 0,
        acreedor: 0,
      },
      estadoPatrimonial: {
        activo: 0,
        pasivoMasPn: 0,
      },
      estadoResultados: {
        negativo: 0,
        positivo: 0,
      },
    }
  );
}

function formatearImporte(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function obtenerValorCampo(fila: FilaHojaTrabajo, campo: CampoImporteFila): number {
  switch (campo) {
    case 'saldosSinAjustar.deudor':
      return fila.saldosSinAjustar.deudor;

    case 'saldosSinAjustar.acreedor':
      return fila.saldosSinAjustar.acreedor;

    case 'ajustes.debe':
      return fila.ajustes.debe;

    case 'ajustes.haber':
      return fila.ajustes.haber;

    case 'saldosAjustados.deudor':
      return fila.saldosAjustados.deudor;

    case 'saldosAjustados.acreedor':
      return fila.saldosAjustados.acreedor;

    case 'estadoPatrimonial.activo':
      return fila.estadoPatrimonial.activo;

    case 'estadoPatrimonial.pasivoMasPn':
      return fila.estadoPatrimonial.pasivoMasPn;

    case 'estadoResultados.negativo':
      return fila.estadoResultados.negativo;

    case 'estadoResultados.positivo':
      return fila.estadoResultados.positivo;
  }
}

function actualizarCampoImporte(
  fila: FilaHojaTrabajo,
  campo: CampoImporteFila,
  valor: number
): FilaHojaTrabajo {
  switch (campo) {
    case 'saldosSinAjustar.deudor':
      return {
        ...fila,
        saldosSinAjustar: {
          ...fila.saldosSinAjustar,
          deudor: valor,
        },
      };

    case 'saldosSinAjustar.acreedor':
      return {
        ...fila,
        saldosSinAjustar: {
          ...fila.saldosSinAjustar,
          acreedor: valor,
        },
      };

    case 'ajustes.debe':
      return {
        ...fila,
        ajustes: {
          ...fila.ajustes,
          debe: valor,
        },
      };

    case 'ajustes.haber':
      return {
        ...fila,
        ajustes: {
          ...fila.ajustes,
          haber: valor,
        },
      };

    case 'saldosAjustados.deudor':
      return {
        ...fila,
        saldosAjustados: {
          ...fila.saldosAjustados,
          deudor: valor,
        },
      };

    case 'saldosAjustados.acreedor':
      return {
        ...fila,
        saldosAjustados: {
          ...fila.saldosAjustados,
          acreedor: valor,
        },
      };

    case 'estadoPatrimonial.activo':
      return {
        ...fila,
        estadoPatrimonial: {
          ...fila.estadoPatrimonial,
          activo: valor,
        },
      };

    case 'estadoPatrimonial.pasivoMasPn':
      return {
        ...fila,
        estadoPatrimonial: {
          ...fila.estadoPatrimonial,
          pasivoMasPn: valor,
        },
      };

    case 'estadoResultados.negativo':
      return {
        ...fila,
        estadoResultados: {
          ...fila.estadoResultados,
          negativo: valor,
        },
      };

    case 'estadoResultados.positivo':
      return {
        ...fila,
        estadoResultados: {
          ...fila.estadoResultados,
          positivo: valor,
        },
      };
  }
}

export default function HojaTrabajoEditor({
  contenido,
  onChange,
  soloLectura = false,
}: HojaTrabajoEditorProps) {
  const { data: cuentasData, isLoading: cargandoCuentas } = useCuentasContablesEjercicio();

  const cuentasContables = cuentasData?.items ?? [];

  const totales = calcularTotales(contenido.filas);

  const resultadoDelEjercicio: ResultadoEjercicioHojaTrabajo = contenido.resultadoDelEjercicio ?? {
    activo: 0,
    pasivoMasPn: 0,
    negativo: 0,
    positivo: 0,
  };

  function actualizarFilas(filas: FilaHojaTrabajo[]) {
    onChange({
      ...contenido,
      filas,
    });
  }

  function agregarFila() {
    actualizarFilas([...contenido.filas, crearFila()]);
  }

  function eliminarFila(indiceFila: number) {
    actualizarFilas(contenido.filas.filter((_, indice) => indice !== indiceFila));
  }

  function seleccionarCuenta(indiceFila: number, idCuenta: number) {
    const cuentaSeleccionada = cuentasContables.find((cuenta) => cuenta.idCuenta === idCuenta);

    const nuevasFilas = contenido.filas.map((fila, indice) => {
      if (indice !== indiceFila) {
        return fila;
      }

      return {
        ...fila,
        idCuenta: cuentaSeleccionada?.idCuenta ?? 0,
        cuenta: cuentaSeleccionada?.nombre ?? '',
      };
    });

    actualizarFilas(nuevasFilas);
  }

  function actualizarImporte(indiceFila: number, campo: CampoImporteFila, valor: number) {
    if (!Number.isFinite(valor) || valor < 0) {
      return;
    }

    const nuevasFilas = contenido.filas.map((fila, indice) => {
      if (indice !== indiceFila) {
        return fila;
      }

      return actualizarCampoImporte(fila, campo, valor);
    });

    actualizarFilas(nuevasFilas);
  }

  function actualizarResultadoEjercicio(campo: keyof ResultadoEjercicioHojaTrabajo, valor: number) {
    const resultadoActualizado: ResultadoEjercicioHojaTrabajo = {
      ...resultadoDelEjercicio,
      [campo]: valor,
    };

    /*
     * Estado patrimonial:
     * Activo y Pasivo + PN son excluyentes.
     */
    if (campo === 'activo' && valor > 0) {
      resultadoActualizado.pasivoMasPn = 0;
    }

    if (campo === 'pasivoMasPn' && valor > 0) {
      resultadoActualizado.activo = 0;
    }

    /*
     * Estado de resultados:
     * Negativo y Positivo son excluyentes.
     */
    if (campo === 'negativo' && valor > 0) {
      resultadoActualizado.positivo = 0;
    }

    if (campo === 'positivo' && valor > 0) {
      resultadoActualizado.negativo = 0;
    }

    onChange({
      ...contenido,
      resultadoDelEjercicio: resultadoActualizado,
    });
  }

  function cuentaYaSeleccionada(idCuenta: number, indiceFilaActual: number): boolean {
    return contenido.filas.some(
      (fila, indice) => indice !== indiceFilaActual && fila.idCuenta === idCuenta
    );
  }

  return (
    <div className="space-y-3">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Hoja de Trabajo</h3>

          <p className="mt-0.5 text-xs text-gray-500">
            Balance de 10 columnas para la resolución contable del ejercicio.
          </p>
        </div>

        {!soloLectura && (
          <button
            type="button"
            onClick={agregarFila}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-green-700 bg-white px-3 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
          >
            <Plus size={15} />
            Agregar línea
          </button>
        )}
      </div>

      {contenido.filas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            Todavía no hay cuentas registradas en la Hoja de Trabajo.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Agregá una línea y seleccioná una cuenta contable para comenzar.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-295 table-fixed border-collapse text-[11px]">
              <colgroup>
                <col className="w-9.5" />
                <col className="w-[190px]" />

                <col className="w-[90px]" />
                <col className="w-[90px]" />

                <col className="w-[90px]" />
                <col className="w-[90px]" />

                <col className="w-[90px]" />
                <col className="w-[90px]" />

                <col className="w-[90px]" />
                <col className="w-[90px]" />

                <col className="w-[90px]" />
                <col className="w-[90px]" />

                <col className="w-[38px]" />
              </colgroup>

              {/* Encabezados agrupados */}
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

                  <th
                    colSpan={2}
                    className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold"
                  >
                    Saldos sin ajustar
                  </th>

                  <th
                    colSpan={2}
                    className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold"
                  >
                    Ajustes
                  </th>

                  <th
                    colSpan={2}
                    className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold"
                  >
                    Saldos ajustados
                  </th>

                  <th
                    colSpan={2}
                    className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold"
                  >
                    Estado patrimonial
                  </th>

                  <th
                    colSpan={2}
                    className="border-r border-gray-200 px-1 py-1.5 text-center font-semibold"
                  >
                    Estado de resultados
                  </th>

                  <th rowSpan={2} className="px-1 py-2">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-500">
                  <th className="px-1 py-1.5 text-center font-medium">Deudor</th>

                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-medium">
                    Acreedor
                  </th>

                  <th className="px-1 py-1.5 text-center font-medium">Debe</th>

                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-medium">
                    Haber
                  </th>

                  <th className="px-1 py-1.5 text-center font-medium">Deudor</th>

                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-medium">
                    Acreedor
                  </th>

                  <th className="px-1 py-1.5 text-center font-medium">Activo</th>

                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-medium">
                    Pasivo + PN
                  </th>

                  <th className="px-1 py-1.5 text-center font-medium">Negativo</th>

                  <th className="border-r border-gray-200 px-1 py-1.5 text-center font-medium">
                    Positivo
                  </th>
                </tr>
              </thead>

              <tbody>
                {contenido.filas.map((fila, indiceFila) => (
                  <tr key={indiceFila} className="border-b border-gray-100">
                    <td className="border-r border-gray-100 px-1 py-1.5 text-center font-medium text-gray-500">
                      {indiceFila + 1}
                    </td>

                    <td className="border-r border-gray-100 px-1.5 py-1.5">
                      <SelectorCuentaContable
                        cuentas={cuentasContables.filter(
                          (cuenta) =>
                            cuenta.idCuenta === fila.idCuenta ||
                            !cuentaYaSeleccionada(cuenta.idCuenta, indiceFila)
                        )}
                        value={fila.idCuenta || null}
                        disabled={cargandoCuentas || soloLectura}
                        placeholder={cargandoCuentas ? 'Cargando cuentas...' : 'Buscar cuenta...'}
                        compacto
                        onSelect={(idCuenta) => seleccionarCuenta(indiceFila, idCuenta)}
                      />
                    </td>

                    <CeldaImporte
                      fila={fila}
                      campo="saldosSinAjustar.deudor"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="saldosSinAjustar.acreedor"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      separador
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="ajustes.debe"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="ajustes.haber"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      separador
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="saldosAjustados.deudor"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="saldosAjustados.acreedor"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      separador
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="estadoPatrimonial.activo"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="estadoPatrimonial.pasivoMasPn"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      separador
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="estadoResultados.negativo"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      soloLectura={soloLectura}
                    />

                    <CeldaImporte
                      fila={fila}
                      campo="estadoResultados.positivo"
                      indiceFila={indiceFila}
                      onChange={actualizarImporte}
                      separador
                      soloLectura={soloLectura}
                    />

                    <td className="px-1 py-1.5 text-center">
                      {!soloLectura && (
                        <button
                          type="button"
                          onClick={() => eliminarFila(indiceFila)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar fila ${indiceFila + 1}`}
                          title="Eliminar fila"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Totales */}
              <tfoot>
                <tr className="border-t border-gray-200 bg-green-50 font-semibold text-gray-800">
                  <td colSpan={2} className="border-r border-gray-200 px-2 py-2 text-center">
                    TOTALES
                  </td>

                  <CeldaTotal valor={totales.saldosSinAjustar.deudor} />

                  <CeldaTotal valor={totales.saldosSinAjustar.acreedor} separador />

                  <CeldaTotal valor={totales.ajustes.debe} />

                  <CeldaTotal valor={totales.ajustes.haber} separador />

                  <CeldaTotal valor={totales.saldosAjustados.deudor} />

                  <CeldaTotal valor={totales.saldosAjustados.acreedor} separador />

                  <CeldaTotal valor={totales.estadoPatrimonial.activo} />

                  <CeldaTotal valor={totales.estadoPatrimonial.pasivoMasPn} separador />

                  <CeldaTotal valor={totales.estadoResultados.negativo} />

                  <CeldaTotal valor={totales.estadoResultados.positivo} separador />

                  <td />
                </tr>

                <tr className="border-t border-gray-300 bg-white">
                  <td
                    colSpan={8}
                    className="border-r border-gray-200 px-3 py-2 text-right text-[11px] font-semibold text-gray-900"
                  >
                    Resultado del ejercicio
                  </td>

                  {/* Activo */}
                  <td className="px-1 py-1.5">
                    <InputImporte
                      value={resultadoDelEjercicio.activo}
                      onChange={(valor) => actualizarResultadoEjercicio('activo', valor)}
                      ariaLabel="Resultado del ejercicio - Activo"
                      disabled={soloLectura}
                      className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] font-medium text-gray-800 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />
                  </td>

                  {/* Pasivo + PN */}
                  <td className="border-r border-gray-200 px-1 py-1.5">
                    <InputImporte
                      value={resultadoDelEjercicio.pasivoMasPn}
                      onChange={(valor) => actualizarResultadoEjercicio('pasivoMasPn', valor)}
                      ariaLabel="Resultado del ejercicio - Pasivo más patrimonio neto"
                      disabled={soloLectura}
                      className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] font-medium text-gray-800 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />
                  </td>

                  {/* Negativo */}
                  <td className="px-1 py-1.5">
                    <InputImporte
                      value={resultadoDelEjercicio.negativo}
                      onChange={(valor) => actualizarResultadoEjercicio('negativo', valor)}
                      ariaLabel="Resultado del ejercicio - Negativo"
                      disabled={soloLectura}
                      className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] font-medium text-gray-800 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />
                  </td>

                  {/* Positivo */}
                  <td className="border-r border-gray-200 px-1 py-1.5">
                    <InputImporte
                      value={resultadoDelEjercicio.positivo}
                      onChange={(valor) => actualizarResultadoEjercicio('positivo', valor)}
                      ariaLabel="Resultado del ejercicio - Positivo"
                      disabled={soloLectura}
                      className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] font-medium text-gray-800 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />
                  </td>

                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Celda editable
// ============================================================================

interface CeldaImporteProps {
  fila: FilaHojaTrabajo;
  campo: CampoImporteFila;
  indiceFila: number;
  separador?: boolean;
  soloLectura?: boolean;
  onChange: (indiceFila: number, campo: CampoImporteFila, valor: number) => void;
}

function CeldaImporte({
  fila,
  campo,
  indiceFila,
  separador = false,
  soloLectura = false,
  onChange,
}: CeldaImporteProps) {
  const valor = obtenerValorCampo(fila, campo);

  return (
    <td className={`px-1 py-1.5 ${separador ? 'border-r border-gray-200' : ''}`}>
      <InputImporte
        value={valor}
        onChange={(nuevoValor) => onChange(indiceFila, campo, nuevoValor)}
        disabled={soloLectura}
        className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] text-gray-700 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
      />
    </td>
  );
}

// ============================================================================
// Celda de total
// ============================================================================

interface CeldaTotalProps {
  valor: number;
  separador?: boolean;
}

function CeldaTotal({ valor, separador = false }: CeldaTotalProps) {
  return (
    <td
      className={`px-1.5 py-2 text-right text-[11px] ${
        separador ? 'border-r border-gray-200' : ''
      }`}
    >
      {valor === 0 ? '-' : formatearImporte(valor)}
    </td>
  );
}
