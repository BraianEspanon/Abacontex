import { CheckCircle2, Plus, Trash2 } from 'lucide-react';

import Button from '../../ui/Button';

import { useCuentasContablesEjercicio } from '../../../hooks/useCuentasContablesEjercicio';

import type {
  AsientoLibroDiario,
  ContenidoLibroDiario,
  MovimientoContable,
} from '../../../types/ejercicio.types';

interface LibroDiarioEditorProps {
  contenido: ContenidoLibroDiario;
  onChange: (contenido: ContenidoLibroDiario) => void;
}

const MOVIMIENTOS: MovimientoContable[] = ['A+', 'A-', 'P+', 'P-', 'PN+', 'PN-', 'R+', 'R-'];

/**
 * Convierte AAAA-MM-DD a DD/MM/AAAA.
 */
function fechaInputAApi(fecha: string): string {
  if (!fecha) return '';

  const [anio, mes, dia] = fecha.split('-');

  if (!anio || !mes || !dia) return '';

  return `${dia}/${mes}/${anio}`;
}

/**
 * Convierte DD/MM/AAAA a AAAA-MM-DD.
 */
function fechaApiAInput(fecha: string): string {
  if (!fecha) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }

  const partes = fecha.split('/');

  if (partes.length !== 3) return '';

  const [dia, mes, anio] = partes;

  if (!dia || !mes || !anio) return '';

  return `${anio}-${mes}-${dia}`;
}

function crearAsiento(numero: number): AsientoLibroDiario {
  return {
    numero,
    fecha: '',
    concepto: '',
    lineas: [],
  };
}

/**
 * Cada cuenta recibe un único folio según su primera aparición.
 * Si vuelve a utilizarse, conserva el mismo número.
 */
function recalcularFolios(asientos: AsientoLibroDiario[]): AsientoLibroDiario[] {
  const foliosPorCuenta = new Map<number, number>();
  let proximoFolio = 1;

  return asientos.map((asiento) => ({
    ...asiento,
    lineas: asiento.lineas.map((linea) => {
      if (!linea.idCuenta || linea.idCuenta <= 0) {
        return {
          ...linea,
          folio: null,
        };
      }

      let folio = foliosPorCuenta.get(linea.idCuenta);

      if (folio === undefined) {
        folio = proximoFolio;
        foliosPorCuenta.set(linea.idCuenta, folio);
        proximoFolio += 1;
      }

      return {
        ...linea,
        folio,
      };
    }),
  }));
}

function formatearImporte(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(valor);
}

export default function LibroDiarioEditor({ contenido, onChange }: LibroDiarioEditorProps) {
  const { data: cuentasData, isLoading: cargandoCuentas } = useCuentasContablesEjercicio();

  const cuentas = cuentasData?.items ?? [];

  function actualizarAsientos(asientos: AsientoLibroDiario[]) {
    onChange({
      asientos: recalcularFolios(asientos),
    });
  }

  function actualizarAsiento(indiceAsiento: number, cambios: Partial<AsientoLibroDiario>) {
    const asientos = contenido.asientos.map((asiento, index) =>
      index === indiceAsiento
        ? {
            ...asiento,
            ...cambios,
          }
        : asiento
    );

    actualizarAsientos(asientos);
  }

  function agregarAsiento() {
    actualizarAsientos([...contenido.asientos, crearAsiento(contenido.asientos.length + 1)]);
  }

  function eliminarAsiento(indiceAsiento: number) {
    const asientos = contenido.asientos
      .filter((_, index) => index !== indiceAsiento)
      .map((asiento, index) => ({
        ...asiento,
        numero: index + 1,
      }));

    actualizarAsientos(asientos);
  }

  function agregarLinea(indiceAsiento: number) {
    const asiento = contenido.asientos[indiceAsiento];

    if (!asiento) return;

    actualizarAsiento(indiceAsiento, {
      lineas: [
        ...asiento.lineas,
        {
          idCuenta: 0,
          cuenta: '',
          movimiento: 'A+',
          folio: null,
          debe: 0,
          haber: 0,
        },
      ],
    });
  }

  function eliminarLinea(indiceAsiento: number, indiceLinea: number) {
    const asiento = contenido.asientos[indiceAsiento];

    if (!asiento) return;

    actualizarAsiento(indiceAsiento, {
      lineas: asiento.lineas.filter((_, index) => index !== indiceLinea),
    });
  }

  function actualizarLinea(
    indiceAsiento: number,
    indiceLinea: number,
    campo: string,
    valor: string | number | null
  ) {
    const asiento = contenido.asientos[indiceAsiento];

    if (!asiento) return;

    const lineas = asiento.lineas.map((linea, index) => {
      if (index !== indiceLinea) return linea;

      if (campo === 'idCuenta') {
        const idCuenta = Number(valor);

        const cuentaSeleccionada = cuentas.find((cuenta) => cuenta.idCuenta === idCuenta);

        return {
          ...linea,
          idCuenta,
          cuenta: cuentaSeleccionada?.nombre ?? '',
        };
      }

      return {
        ...linea,
        [campo]: valor,
      };
    });

    actualizarAsiento(indiceAsiento, { lineas });
  }

  return (
    <div className="space-y-5">
      {contenido.asientos.map((asiento, indiceAsiento) => {
        const totalDebe = asiento.lineas.reduce(
          (total, linea) => total + Number(linea.debe || 0),
          0
        );

        const totalHaber = asiento.lineas.reduce(
          (total, linea) => total + Number(linea.haber || 0),
          0
        );

        const balanceado = asiento.lineas.length > 0 && Math.abs(totalDebe - totalHaber) <= 0.01;

        return (
          <section
            key={asiento.numero}
            className="rounded-xl border border-gray-300 bg-white px-5 py-4 shadow-sm"
          >
            {/* ==============================================================
                Encabezado del asiento
            ============================================================== */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="border-r border-gray-300 pr-4">
                <p className="pb-2 text-sm font-semibold text-gray-900">
                  Asiento N° {asiento.numero}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Fecha <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  value={fechaApiAInput(asiento.fecha)}
                  onChange={(event) =>
                    actualizarAsiento(indiceAsiento, {
                      fecha: fechaInputAApi(event.target.value),
                    })
                  }
                  className="w-[150px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="w-full sm:w-[420px]">
                <label className="mb-1 block text-xs font-medium text-gray-700">Concepto</label>

                <input
                  type="text"
                  value={asiento.concepto}
                  onChange={(event) =>
                    actualizarAsiento(indiceAsiento, {
                      concepto: event.target.value,
                    })
                  }
                  placeholder="Descripción del asiento"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              <span
                className={`mb-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  balanceado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {balanceado && <CheckCircle2 size={13} />}

                {balanceado ? 'Balanceado' : 'Sin balancear'}
              </span>

              <button
                type="button"
                onClick={() => eliminarAsiento(indiceAsiento)}
                className="ml-auto mb-1 rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                title="Eliminar asiento"
                aria-label={`Eliminar asiento ${asiento.numero}`}
              >
                <Trash2 size={17} />
              </button>
            </div>

            {/* ==============================================================
                Agregar línea
            ============================================================== */}
            <div className="mx-auto mt-3 flex w-[92%] justify-end">
              <button
                type="button"
                onClick={() => agregarLinea(indiceAsiento)}
                className="flex items-center gap-1 text-sm font-medium text-green-700 transition-colors hover:text-green-800"
              >
                <Plus size={15} />
                Agregar línea
              </button>
            </div>

            {/* ==============================================================
                Tabla
            ============================================================== */}
            <div className="mx-auto mt-2 w-[92%] overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#9db79c] text-gray-900">
                    <th className="w-[125px] border border-gray-300 px-3 py-2 text-center font-medium">
                      Fecha
                    </th>

                    <th className="border border-gray-300 px-3 py-2 text-center font-medium">
                      Concepto
                    </th>

                    <th className="w-[100px] border border-gray-300 px-3 py-2 text-center font-medium">
                      N° Folio
                    </th>

                    <th className="w-[180px] border border-gray-300 px-3 py-2 text-center font-medium">
                      Debe
                    </th>

                    <th className="w-[180px] border border-gray-300 px-3 py-2 text-center font-medium">
                      Haber
                    </th>

                    <th className="w-12 bg-white" />
                  </tr>
                </thead>

                <tbody>
                  {asiento.lineas.map((linea, indiceLinea) => (
                    <tr key={indiceLinea}>
                      {/* Fecha del asiento */}
                      <td className="border border-gray-300 bg-white px-3 py-2 text-center text-gray-700">
                        {asiento.fecha || '—'}
                      </td>

                      {/* Cuenta + Movimiento */}
                      <td className="border border-gray-300 p-2">
                        <div className="flex min-w-[330px] gap-2">
                          <select
                            value={linea.idCuenta || ''}
                            disabled={cargandoCuentas}
                            onChange={(event) =>
                              actualizarLinea(
                                indiceAsiento,
                                indiceLinea,
                                'idCuenta',
                                Number(event.target.value)
                              )
                            }
                            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                          >
                            <option value="">
                              {cargandoCuentas ? 'Cargando cuentas...' : 'Seleccionar cuenta'}
                            </option>

                            {cuentas.map((cuenta) => (
                              <option key={cuenta.idCuenta} value={cuenta.idCuenta}>
                                {cuenta.codigo} - {cuenta.nombre}
                              </option>
                            ))}
                          </select>

                          <select
                            value={linea.movimiento}
                            onChange={(event) =>
                              actualizarLinea(
                                indiceAsiento,
                                indiceLinea,
                                'movimiento',
                                event.target.value as MovimientoContable
                              )
                            }
                            aria-label={`Movimiento de la línea ${indiceLinea + 1}`}
                            className="w-[78px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                          >
                            {MOVIMIENTOS.map((movimiento) => (
                              <option key={movimiento} value={movimiento}>
                                {movimiento}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Folio */}
                      <td className="border border-gray-300 bg-white px-3 py-2 text-center">
                        <span
                          className="text-sm text-gray-700"
                          title="El folio se asigna automáticamente según la cuenta contable."
                        >
                          {linea.folio ?? '—'}
                        </span>
                      </td>

                      {/* Debe */}
                      <td className="border border-gray-300 bg-white p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={linea.debe || ''}
                          onChange={(event) =>
                            actualizarLinea(
                              indiceAsiento,
                              indiceLinea,
                              'debe',
                              Number(event.target.value)
                            )
                          }
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />
                      </td>

                      {/* Haber */}
                      <td className="border border-gray-300 bg-white p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={linea.haber || ''}
                          onChange={(event) =>
                            actualizarLinea(
                              indiceAsiento,
                              indiceLinea,
                              'haber',
                              Number(event.target.value)
                            )
                          }
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />
                      </td>

                      {/* Eliminar línea */}
                      <td className="bg-white px-2 text-center">
                        <button
                          type="button"
                          onClick={() => eliminarLinea(indiceAsiento, indiceLinea)}
                          className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                          title="Eliminar línea"
                          aria-label={`Eliminar línea ${indiceLinea + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {asiento.lineas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="border border-gray-300 px-4 py-6 text-center text-sm text-gray-400"
                      >
                        Agregá una línea para comenzar el asiento.
                      </td>
                    </tr>
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-gray-50 font-semibold text-gray-800">
                    <td colSpan={3} className="border border-gray-300 px-3 py-2 text-right">
                      Total del asiento
                    </td>

                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ${formatearImporte(totalDebe)}
                    </td>

                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ${formatearImporte(totalHaber)}
                    </td>

                    <td className="bg-white" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        );
      })}

      {/* ====================================================================
          Agregar nuevo asiento
      ==================================================================== */}
      <Button
        type="button"
        label="Agregar nuevo asiento"
        variant="outline"
        icon={<Plus size={17} />}
        onClick={agregarAsiento}
        className="w-full"
      />
    </div>
  );
}
