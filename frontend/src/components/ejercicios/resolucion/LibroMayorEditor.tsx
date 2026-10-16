import { Info, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import Button from '../../ui/Button';

import { useCuentasContablesEjercicio } from '../../../hooks/useCuentasContablesEjercicio';

import type {
  ContenidoLibroMayor,
  CuentaLibroMayor,
  MovimientoLibroMayor,
  TipoSaldoMayor,
} from '../../../types/ejercicio.types';

interface LibroMayorEditorProps {
  contenido: ContenidoLibroMayor;
  onChange: (contenido: ContenidoLibroMayor) => void;
}

type LadoMayor = 'DEBE' | 'HABER';

interface LadoMovimiento {
  movimiento: MovimientoLibroMayor;
  indice: number;
  lado: LadoMayor;
}

function crearMovimiento(): MovimientoLibroMayor {
  return {
    fecha: '',
    concepto: '',
    debe: 0,
    haber: 0,
    saldo: 0,
  };
}

function convertirFechaParaInput(fecha: string): string {
  if (!fecha) return '';

  const coincidencia = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!coincidencia) return fecha;

  const [, dia, mes, anio] = coincidencia;

  return `${anio}-${mes}-${dia}`;
}

function convertirFechaParaContenido(fecha: string): string {
  if (!fecha) return '';

  const coincidencia = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!coincidencia) return fecha;

  const [, anio, mes, dia] = coincidencia;

  return `${dia}/${mes}/${anio}`;
}

function calcularCuenta(cuenta: CuentaLibroMayor): CuentaLibroMayor {
  let acumuladoDebe = 0;
  let acumuladoHaber = 0;

  const movimientos = cuenta.movimientos.map((movimiento) => {
    acumuladoDebe += movimiento.debe || 0;
    acumuladoHaber += movimiento.haber || 0;

    return {
      ...movimiento,
      saldo: Number(Math.abs(acumuladoDebe - acumuladoHaber).toFixed(2)),
    };
  });

  const diferencia = Number((acumuladoDebe - acumuladoHaber).toFixed(2));

  return {
    ...cuenta,
    movimientos,
    saldoFinal: Math.abs(diferencia),
  };
}

function formatearImporte(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export default function LibroMayorEditor({ contenido, onChange }: LibroMayorEditorProps) {
  const { data: cuentasData, isLoading: cargandoCuentas } = useCuentasContablesEjercicio();

  const cuentasContables = cuentasData?.items ?? [];

  const [mostrarNuevaCuenta, setMostrarNuevaCuenta] = useState(false);
  const [cuentaNuevaId, setCuentaNuevaId] = useState('');

  /*
   * El backend no guarda explícitamente si una línea vacía pertenece
   * al DEBE o al HABER.
   *
   * Para mantener esa información únicamente en la interfaz usamos:
   *
   * índice de cuenta -> índice de movimiento -> lado
   *
   * A diferencia de guardar la referencia del objeto MovimientoLibroMayor,
   * los índices no cambian cuando calcularCuenta() reconstruye los objetos.
   */
  const ladosMovimientosRef = useRef<Map<number, Map<number, LadoMayor>>>(new Map());

  function actualizarCuentas(cuentas: CuentaLibroMayor[]) {
    onChange({
      cuentas: cuentas.map(calcularCuenta),
    });
  }

  function obtenerMapaCuenta(indiceCuenta: number): Map<number, LadoMayor> {
    let mapaCuenta = ladosMovimientosRef.current.get(indiceCuenta);

    if (!mapaCuenta) {
      mapaCuenta = new Map<number, LadoMayor>();
      ladosMovimientosRef.current.set(indiceCuenta, mapaCuenta);
    }

    return mapaCuenta;
  }

  function registrarLadoMovimiento(
    indiceCuenta: number,
    indiceMovimiento: number,
    lado: LadoMayor
  ) {
    const mapaCuenta = obtenerMapaCuenta(indiceCuenta);
    mapaCuenta.set(indiceMovimiento, lado);
  }

  function obtenerLadoMovimiento(
    indiceCuenta: number,
    indiceMovimiento: number,
    movimiento: MovimientoLibroMayor
  ): LadoMayor {
    /*
     * Primero respetamos el lado registrado por la interfaz.
     * Esto es especialmente importante para las líneas cuyo importe
     * todavía es 0.
     */
    const ladoRegistrado = ladosMovimientosRef.current.get(indiceCuenta)?.get(indiceMovimiento);

    if (ladoRegistrado) {
      return ladoRegistrado;
    }

    /*
     * Si la información provino del backend, inferimos el lado
     * a partir del importe existente.
     */
    if (movimiento.haber > 0) {
      registrarLadoMovimiento(indiceCuenta, indiceMovimiento, 'HABER');
      return 'HABER';
    }

    if (movimiento.debe > 0) {
      registrarLadoMovimiento(indiceCuenta, indiceMovimiento, 'DEBE');
      return 'DEBE';
    }

    /*
     * Una línea completamente vacía proveniente del backend no permite
     * conocer su lado porque ese dato no se persiste.
     */
    registrarLadoMovimiento(indiceCuenta, indiceMovimiento, 'DEBE');

    return 'DEBE';
  }

  function abrirNuevaCuenta() {
    setCuentaNuevaId('');
    setMostrarNuevaCuenta(true);
  }

  function cancelarNuevaCuenta() {
    setCuentaNuevaId('');
    setMostrarNuevaCuenta(false);
  }

  function confirmarNuevaCuenta(idCuenta: number) {
    if (!idCuenta) return;

    const cuentaSeleccionada = cuentasContables.find((cuenta) => cuenta.idCuenta === idCuenta);

    if (!cuentaSeleccionada) return;

    const yaExiste = contenido.cuentas.some((cuenta) => cuenta.idCuenta === idCuenta);

    if (yaExiste) return;

    const nuevaCuenta: CuentaLibroMayor = {
      idCuenta: cuentaSeleccionada.idCuenta,
      cuenta: cuentaSeleccionada.nombre,
      movimientos: [],
      saldoFinal: 0,
      tipoSaldo: null,
    };

    actualizarCuentas([...contenido.cuentas, nuevaCuenta]);

    setCuentaNuevaId('');
    setMostrarNuevaCuenta(false);
  }

  function eliminarCuenta(indiceCuenta: number) {
    const nuevasCuentas = contenido.cuentas.filter((_, indice) => indice !== indiceCuenta);

    /*
     * Como al eliminar una cuenta cambian los índices de las cuentas
     * posteriores, reconstruimos el mapa visual.
     */
    const nuevoMapa = new Map<number, Map<number, LadoMayor>>();

    ladosMovimientosRef.current.forEach((mapaMovimientos, indiceActual) => {
      if (indiceActual < indiceCuenta) {
        nuevoMapa.set(indiceActual, mapaMovimientos);
      }

      if (indiceActual > indiceCuenta) {
        nuevoMapa.set(indiceActual - 1, mapaMovimientos);
      }
    });

    ladosMovimientosRef.current = nuevoMapa;

    actualizarCuentas(nuevasCuentas);
  }

  function actualizarTipoSaldo(indiceCuenta: number, tipoSaldo: TipoSaldoMayor | null) {
    const nuevasCuentas = contenido.cuentas.map((cuenta, indice) =>
      indice === indiceCuenta
        ? {
            ...cuenta,
            tipoSaldo,
          }
        : cuenta
    );

    actualizarCuentas(nuevasCuentas);
  }

  function agregarMovimiento(indiceCuenta: number, lado: LadoMayor) {
    const cuenta = contenido.cuentas[indiceCuenta];

    if (!cuenta) return;

    const indiceMovimientoNuevo = cuenta.movimientos.length;
    const movimientoNuevo = crearMovimiento();

    /*
     * Registramos explícitamente dónde nació la nueva fila.
     * Aunque Debe y Haber sean 0, la UI conoce su lado.
     */
    registrarLadoMovimiento(indiceCuenta, indiceMovimientoNuevo, lado);

    const nuevasCuentas = contenido.cuentas.map((cuentaActual, indice) => {
      if (indice !== indiceCuenta) {
        return cuentaActual;
      }

      return {
        ...cuentaActual,
        movimientos: [...cuentaActual.movimientos, movimientoNuevo],
      };
    });

    actualizarCuentas(nuevasCuentas);
  }

  function eliminarMovimiento(indiceCuenta: number, indiceMovimiento: number) {
    const nuevasCuentas = contenido.cuentas.map((cuenta, indice) => {
      if (indice !== indiceCuenta) {
        return cuenta;
      }

      return {
        ...cuenta,
        movimientos: cuenta.movimientos.filter(
          (_, indiceActual) => indiceActual !== indiceMovimiento
        ),
      };
    });

    /*
     * Al borrar un movimiento, los índices posteriores disminuyen en 1.
     * Reconstruimos únicamente el mapa de esta cuenta.
     */
    const mapaAnterior = ladosMovimientosRef.current.get(indiceCuenta);

    if (mapaAnterior) {
      const mapaNuevo = new Map<number, LadoMayor>();

      mapaAnterior.forEach((lado, indiceActual) => {
        if (indiceActual < indiceMovimiento) {
          mapaNuevo.set(indiceActual, lado);
        }

        if (indiceActual > indiceMovimiento) {
          mapaNuevo.set(indiceActual - 1, lado);
        }
      });

      ladosMovimientosRef.current.set(indiceCuenta, mapaNuevo);
    }

    actualizarCuentas(nuevasCuentas);
  }

  function actualizarMovimiento(
    indiceCuenta: number,
    indiceMovimiento: number,
    cambios: Partial<MovimientoLibroMayor>
  ) {
    const nuevasCuentas = contenido.cuentas.map((cuenta, indice) => {
      if (indice !== indiceCuenta) {
        return cuenta;
      }

      return {
        ...cuenta,
        movimientos: cuenta.movimientos.map((movimiento, indiceActual) =>
          indiceActual === indiceMovimiento
            ? {
                ...movimiento,
                ...cambios,
              }
            : movimiento
        ),
      };
    });

    /*
     * calcularCuenta() puede crear nuevos objetos, pero eso ya no afecta
     * al lado visual porque ahora lo identificamos mediante índices.
     */
    actualizarCuentas(nuevasCuentas);
  }

  function actualizarImporte(
    indiceCuenta: number,
    indiceMovimiento: number,
    lado: LadoMayor,
    valor: string
  ) {
    const numero = valor === '' ? 0 : Number(valor);

    if (!Number.isFinite(numero) || numero < 0) {
      return;
    }

    /*
     * Conservamos explícitamente el lado aunque el usuario borre
     * el importe y vuelva a quedar en 0.
     */
    registrarLadoMovimiento(indiceCuenta, indiceMovimiento, lado);

    if (lado === 'DEBE') {
      actualizarMovimiento(indiceCuenta, indiceMovimiento, {
        debe: numero,
        haber: 0,
      });

      return;
    }

    actualizarMovimiento(indiceCuenta, indiceMovimiento, {
      debe: 0,
      haber: numero,
    });
  }

  function obtenerMovimientosPorLado(
    cuenta: CuentaLibroMayor,
    indiceCuenta: number
  ): {
    debe: LadoMovimiento[];
    haber: LadoMovimiento[];
  } {
    const debe: LadoMovimiento[] = [];
    const haber: LadoMovimiento[] = [];

    cuenta.movimientos.forEach((movimiento, indiceMovimiento) => {
      const lado = obtenerLadoMovimiento(indiceCuenta, indiceMovimiento, movimiento);

      const item: LadoMovimiento = {
        movimiento,
        indice: indiceMovimiento,
        lado,
      };

      if (lado === 'DEBE') {
        debe.push(item);
      } else {
        haber.push(item);
      }
    });

    return {
      debe,
      haber,
    };
  }

  return (
    <div className="space-y-5">
      {/* ================================================================
          Acción superior
      ================================================================= */}
      <div className="flex justify-end">
        <Button
          type="button"
          label="Agregar cuenta"
          variant="outline"
          icon={<Plus size={17} />}
          onClick={abrirNuevaCuenta}
          disabled={mostrarNuevaCuenta}
          className="px-4 py-2 text-sm"
        />
      </div>

      {/* ================================================================
          Cuentas del Libro Mayor
      ================================================================= */}
      {contenido.cuentas.length === 0 && !mostrarNuevaCuenta ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            Todavía no hay cuentas registradas en el Libro Mayor.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Agregá una cuenta contable para comenzar la mayorización.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-5">
          {contenido.cuentas.map((cuenta, indiceCuenta) => {
            const cuentaContable = cuentasContables.find(
              (item) => item.idCuenta === cuenta.idCuenta
            );

            const { debe, haber } = obtenerMovimientosPorLado(cuenta, indiceCuenta);

            const totalDebe = cuenta.movimientos.reduce(
              (total, movimiento) => total + Number(movimiento.debe || 0),
              0
            );

            const totalHaber = cuenta.movimientos.reduce(
              (total, movimiento) => total + Number(movimiento.haber || 0),
              0
            );

            return (
              <section
                key={`${cuenta.idCuenta}-${indiceCuenta}`}
                className="w-full max-w-[570px] overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm"
              >
                {/* Encabezado */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                    {indiceCuenta + 1}
                  </div>

                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                    {cuenta.cuenta}
                  </p>

                  {cuentaContable && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {cuentaContable.rubro.tipoCuenta.nombre}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => eliminarCuenta(indiceCuenta)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar cuenta ${cuenta.cuenta}`}
                    title="Eliminar cuenta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* DEBE / HABER */}
                <div className="grid grid-cols-2">
                  {/* DEBE */}
                  <div className="border-r border-gray-300">
                    <div className="border-y border-gray-300 py-2 text-center">
                      <span className="text-sm font-semibold uppercase tracking-wide text-green-700">
                        Debe
                      </span>
                    </div>

                    <div className="grid grid-cols-[105px_1fr_100px_34px] border-b border-gray-300 bg-gray-50 text-[11px] font-medium text-gray-600">
                      <div className="border-r border-gray-300 px-2 py-2 text-center">Fecha</div>

                      <div className="border-r border-gray-300 px-2 py-2 text-center">Concepto</div>

                      <div className="border-r border-gray-300 px-2 py-2 text-center">Monto</div>

                      <div />
                    </div>

                    {debe.map(({ movimiento, indice }) => (
                      <div
                        key={indice}
                        className="grid grid-cols-[105px_1fr_100px_34px] border-b border-gray-200"
                      >
                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="date"
                            value={convertirFechaParaInput(movimiento.fecha)}
                            onChange={(event) =>
                              actualizarMovimiento(indiceCuenta, indice, {
                                fecha: convertirFechaParaContenido(event.target.value),
                              })
                            }
                            className="w-full rounded border border-gray-300 px-1.5 py-1.5 text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="text"
                            value={movimiento.concepto}
                            maxLength={255}
                            placeholder="Concepto"
                            onChange={(event) =>
                              actualizarMovimiento(indiceCuenta, indice, {
                                concepto: event.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1.5 text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={movimiento.debe === 0 ? '' : movimiento.debe}
                            placeholder="0,00"
                            onChange={(event) =>
                              actualizarImporte(indiceCuenta, indice, 'DEBE', event.target.value)
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1.5 text-right text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => eliminarMovimiento(indiceCuenta, indice)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Eliminar movimiento del Debe"
                            title="Eliminar movimiento"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => agregarMovimiento(indiceCuenta, 'DEBE')}
                      className="flex w-full items-center gap-1.5 px-3 py-3 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
                    >
                      <Plus size={14} />
                      Agregar línea
                    </button>
                  </div>

                  {/* HABER */}
                  <div>
                    <div className="border-y border-gray-300 py-2 text-center">
                      <span className="text-sm font-semibold uppercase tracking-wide text-green-700">
                        Haber
                      </span>
                    </div>

                    <div className="grid grid-cols-[105px_1fr_100px_34px] border-b border-gray-300 bg-gray-50 text-[11px] font-medium text-gray-600">
                      <div className="border-r border-gray-300 px-2 py-2 text-center">Fecha</div>

                      <div className="border-r border-gray-300 px-2 py-2 text-center">Concepto</div>

                      <div className="border-r border-gray-300 px-2 py-2 text-center">Monto</div>

                      <div />
                    </div>

                    {haber.map(({ movimiento, indice }) => (
                      <div
                        key={indice}
                        className="grid grid-cols-[105px_1fr_100px_34px] border-b border-gray-200"
                      >
                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="date"
                            value={convertirFechaParaInput(movimiento.fecha)}
                            onChange={(event) =>
                              actualizarMovimiento(indiceCuenta, indice, {
                                fecha: convertirFechaParaContenido(event.target.value),
                              })
                            }
                            className="w-full rounded border border-gray-300 px-1.5 py-1.5 text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="text"
                            value={movimiento.concepto}
                            maxLength={255}
                            placeholder="Concepto"
                            onChange={(event) =>
                              actualizarMovimiento(indiceCuenta, indice, {
                                concepto: event.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1.5 text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="border-r border-gray-200 p-1.5">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={movimiento.haber === 0 ? '' : movimiento.haber}
                            placeholder="0,00"
                            onChange={(event) =>
                              actualizarImporte(indiceCuenta, indice, 'HABER', event.target.value)
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1.5 text-right text-[11px] text-gray-700 outline-none focus:border-green-600"
                          />
                        </div>

                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => eliminarMovimiento(indiceCuenta, indice)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Eliminar movimiento del Haber"
                            title="Eliminar movimiento"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => agregarMovimiento(indiceCuenta, 'HABER')}
                      className="flex w-full items-center gap-1.5 px-3 py-3 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
                    >
                      <Plus size={14} />
                      Agregar línea
                    </button>
                  </div>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-[1fr_1fr_1fr_150px] border-t border-gray-300 bg-gray-100">
                  <div className="border-r border-gray-300 px-3 py-3">
                    <p className="text-xs font-semibold text-gray-700">Total Debe</p>

                    <p className="mt-1 text-sm text-gray-600">$ {formatearImporte(totalDebe)}</p>
                  </div>

                  <div className="border-r border-gray-300 px-3 py-3">
                    <p className="text-xs font-semibold text-gray-700">Total Haber</p>

                    <p className="mt-1 text-sm text-gray-600">$ {formatearImporte(totalHaber)}</p>
                  </div>

                  <div className="border-r border-gray-300 px-3 py-3">
                    <p className="text-xs font-semibold text-gray-700">Saldo final</p>

                    <p className="mt-1 text-sm text-gray-600">
                      $ {formatearImporte(cuenta.saldoFinal)}
                    </p>
                  </div>

                  <div className="flex items-center px-2 py-3">
                    <select
                      value={cuenta.tipoSaldo ?? ''}
                      onChange={(event) =>
                        actualizarTipoSaldo(
                          indiceCuenta,
                          event.target.value ? (event.target.value as TipoSaldoMayor) : null
                        )
                      }
                      aria-label={`Tipo de saldo de ${cuenta.cuenta}`}
                      className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    >
                      <option value="">Seleccione saldo</option>

                      <option value="DEUDOR">Deudor</option>

                      <option value="ACREEDOR">Acreedor</option>
                    </select>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ================================================================
          Nueva cuenta
      ================================================================= */}
      {mostrarNuevaCuenta && (
        <section className="mt-8 rounded-xl border border-dashed border-green-300 bg-green-50/30 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-600 text-green-700">
              <Plus size={15} />
            </div>

            <h3 className="text-sm font-semibold text-gray-900">Nueva cuenta</h3>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
              En edición
            </span>

            <button
              type="button"
              onClick={cancelarNuevaCuenta}
              className="ml-auto rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Cancelar nueva cuenta"
              title="Cancelar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <label
                htmlFor="nueva-cuenta-mayor"
                className="mb-1.5 block text-xs font-medium text-gray-700"
              >
                Seleccionar cuenta del plan de cuentas <span className="text-red-500">*</span>
              </label>

              <select
                id="nueva-cuenta-mayor"
                value={cuentaNuevaId}
                disabled={cargandoCuentas}
                onChange={(event) => {
                  const valor = event.target.value;

                  setCuentaNuevaId(valor);

                  if (valor) {
                    confirmarNuevaCuenta(Number(valor));
                  }
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              >
                <option value="">
                  {cargandoCuentas ? 'Cargando cuentas...' : 'Buscar y seleccionar cuenta...'}
                </option>

                {cuentasContables.map((cuenta) => {
                  const yaSeleccionada = contenido.cuentas.some(
                    (item) => item.idCuenta === cuenta.idCuenta
                  );

                  return (
                    <option key={cuenta.idCuenta} value={cuenta.idCuenta} disabled={yaSeleccionada}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center rounded-lg bg-green-50 px-4 py-3">
              <Info size={18} className="mr-3 shrink-0 text-green-700" />

              <p className="text-xs leading-5 text-gray-600">
                Seleccioná una cuenta del plan de cuentas para agregar una nueva tarjeta al Libro
                Mayor.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
