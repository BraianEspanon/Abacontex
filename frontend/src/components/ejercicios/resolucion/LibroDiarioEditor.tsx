import { Plus, Trash2 } from 'lucide-react';

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
 * Convierte la fecha utilizada por el input HTML:
 * AAAA-MM-DD
 *
 * al formato esperado por el backend:
 * DD/MM/AAAA
 */
function fechaInputAApi(fecha: string): string {
  if (!fecha) return '';

  const [anio, mes, dia] = fecha.split('-');

  if (!anio || !mes || !dia) return '';

  return `${dia}/${mes}/${anio}`;
}

/**
 * Convierte la fecha recibida desde el backend:
 * DD/MM/AAAA
 *
 * al formato requerido por input type="date":
 * AAAA-MM-DD
 */
function fechaApiAInput(fecha: string): string {
  if (!fecha) return '';

  // Por compatibilidad, si ya viniera en formato AAAA-MM-DD,
  // lo dejamos como está.
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
 * Recalcula los folios de toda la resolución.
 *
 * Cada cuenta contable recibe un único número de folio según
 * el orden de su primera aparición dentro del Libro Diario.
 *
 * Si la misma cuenta vuelve a utilizarse en otro asiento,
 * conserva el mismo número de folio.
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
      index === indiceAsiento ? { ...asiento, ...cambios } : asiento
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
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Asiento N° {asiento.numero}</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Fecha</label>

                <input
                  type="date"
                  value={fechaApiAInput(asiento.fecha)}
                  onChange={(event) =>
                    actualizarAsiento(indiceAsiento, {
                      fecha: fechaInputAApi(event.target.value),
                    })
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="min-w-64 flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Concepto</label>

                <input
                  type="text"
                  value={asiento.concepto}
                  onChange={(event) =>
                    actualizarAsiento(indiceAsiento, {
                      concepto: event.target.value,
                    })
                  }
                  placeholder="Descripción del asiento"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  balanceado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {balanceado ? 'Balanceado' : 'Sin balancear'}
              </span>

              <button
                type="button"
                onClick={() => eliminarAsiento(indiceAsiento)}
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
                title="Eliminar asiento"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-green-100 text-gray-700">
                    <th className="border border-gray-200 px-3 py-2 text-left">Cuenta</th>

                    <th className="border border-gray-200 px-3 py-2 text-left">Movimiento</th>

                    <th className="border border-gray-200 px-3 py-2">N° Folio</th>

                    <th className="border border-gray-200 px-3 py-2">Debe</th>

                    <th className="border border-gray-200 px-3 py-2">Haber</th>

                    <th className="w-12 border border-gray-200" />
                  </tr>
                </thead>

                <tbody>
                  {asiento.lineas.map((linea, indiceLinea) => (
                    <tr key={indiceLinea}>
                      <td className="border border-gray-200 p-2">
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
                          className="w-full rounded-md border border-gray-300 px-2 py-2"
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
                      </td>

                      <td className="border border-gray-200 p-2">
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
                          className="w-full rounded-md border border-gray-300 px-2 py-2"
                        >
                          {MOVIMIENTOS.map((movimiento) => (
                            <option key={movimiento} value={movimiento}>
                              {movimiento}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border border-gray-200 bg-gray-50 p-2 text-center">
                        <span
                          className="text-sm font-medium text-gray-700"
                          title="El folio se asigna automáticamente según la cuenta contable."
                        >
                          {linea.folio ?? '—'}
                        </span>
                      </td>

                      <td className="border border-gray-200 p-2">
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
                          className="w-full rounded-md border border-gray-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-gray-200 p-2">
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
                          className="w-full rounded-md border border-gray-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-gray-200 text-center">
                        <button
                          type="button"
                          onClick={() => eliminarLinea(indiceAsiento, indiceLinea)}
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Eliminar línea"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={6} className="border border-gray-200 p-2">
                      <button
                        type="button"
                        onClick={() => agregarLinea(indiceAsiento)}
                        className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
                      >
                        <Plus size={15} />
                        Agregar línea
                      </button>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="border border-gray-200 px-3 py-2 text-right">
                      Total del asiento
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-right">
                      ${totalDebe.toLocaleString('es-AR')}
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-right">
                      ${totalHaber.toLocaleString('es-AR')}
                    </td>

                    <td className="border border-gray-200" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        );
      })}

      <button
        type="button"
        onClick={agregarAsiento}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-green-700 hover:bg-green-50"
      >
        <Plus size={17} />
        Agregar nuevo asiento
      </button>
    </div>
  );
}
