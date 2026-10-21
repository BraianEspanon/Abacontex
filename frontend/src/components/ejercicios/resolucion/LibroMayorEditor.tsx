import { CirclePlus, Info, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../ui/Button';

import { useCuentasContablesEjercicio } from '../../../hooks/useCuentasContablesEjercicio';

import SelectorCuentaContable from './SelectorCuentaContable';

import type {
  ContenidoLibroMayor,
  CuentaContableEjercicio,
  CuentaLibroMayor,
  LineaLibroMayor,
  TipoSaldoMayor,
} from '../../../types/ejercicio.types';

interface LibroMayorEditorProps {
  contenido: ContenidoLibroMayor;
  onChange: (contenido: ContenidoLibroMayor) => void;
}

type LadoMayor = 'DEBE' | 'HABER';

const LINEA_VACIA: LineaLibroMayor = {
  fecha: '',
  idContraCuenta: 0,
  contraCuenta: '',
  monto: 0,
};

function formatearImporte(valor: number) {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function fechaApiAInput(fecha: string): string {
  if (!fecha) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha;
  }

  const match = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return '';
  }

  const [, dia, mes, anio] = match;

  return `${anio}-${mes}-${dia}`;
}

function fechaInputAApi(fecha: string): string {
  if (!fecha) {
    return '';
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
    return fecha;
  }

  const match = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return '';
  }

  const [, anio, mes, dia] = match;

  return `${dia}/${mes}/${anio}`;
}

function calcularTotales(cuenta: CuentaLibroMayor) {
  const totalDebe = Number(
    cuenta.debe.reduce((acumulado, linea) => acumulado + (linea.monto || 0), 0).toFixed(2)
  );

  const totalHaber = Number(
    cuenta.haber.reduce((acumulado, linea) => acumulado + (linea.monto || 0), 0).toFixed(2)
  );

  const diferencia = Number((totalDebe - totalHaber).toFixed(2));

  return {
    totalDebe,
    totalHaber,
    saldo: Math.abs(diferencia),
  };
}

function crearCuentaVacia(cuenta: CuentaContableEjercicio): CuentaLibroMayor {
  return {
    idCuenta: cuenta.idCuenta,
    cuenta: cuenta.nombre,
    debe: [],
    haber: [],
    tipoSaldo: null,
  };
}

export default function LibroMayorEditor({ contenido, onChange }: LibroMayorEditorProps) {
  const [mostrarNuevaCuenta, setMostrarNuevaCuenta] = useState(false);

  const { data: cuentasData, isLoading: cargandoCuentas } = useCuentasContablesEjercicio();

  const cuentasContables: CuentaContableEjercicio[] = useMemo(
    () => cuentasData?.items ?? [],
    [cuentasData?.items]
  );

  const idsCuentasUtilizadas = useMemo(
    () => new Set(contenido.cuentas.map((cuenta) => cuenta.idCuenta)),
    [contenido.cuentas]
  );

  const cuentasDisponibles = useMemo(
    () => cuentasContables.filter((cuenta) => !idsCuentasUtilizadas.has(cuenta.idCuenta)),
    [cuentasContables, idsCuentasUtilizadas]
  );

  function actualizarCuenta(indiceCuenta: number, cuentaActualizada: CuentaLibroMayor) {
    const cuentas = contenido.cuentas.map((cuenta, index) =>
      index === indiceCuenta ? cuentaActualizada : cuenta
    );

    onChange({
      ...contenido,
      cuentas,
    });
  }

  function agregarCuenta(idCuenta: number) {
    const cuentaContable = cuentasContables.find((cuenta) => cuenta.idCuenta === idCuenta);

    if (!cuentaContable) {
      return;
    }

    if (idsCuentasUtilizadas.has(cuentaContable.idCuenta)) {
      return;
    }

    onChange({
      ...contenido,
      cuentas: [...contenido.cuentas, crearCuentaVacia(cuentaContable)],
    });
  }

  function eliminarCuenta(indiceCuenta: number) {
    onChange({
      ...contenido,
      cuentas: contenido.cuentas.filter((_, index) => index !== indiceCuenta),
    });
  }

  function agregarLinea(indiceCuenta: number, lado: LadoMayor) {
    const cuenta = contenido.cuentas[indiceCuenta];

    if (!cuenta) {
      return;
    }

    const nuevaLinea: LineaLibroMayor = {
      ...LINEA_VACIA,
    };

    if (lado === 'DEBE') {
      actualizarCuenta(indiceCuenta, {
        ...cuenta,
        debe: [...cuenta.debe, nuevaLinea],
      });

      return;
    }

    actualizarCuenta(indiceCuenta, {
      ...cuenta,
      haber: [...cuenta.haber, nuevaLinea],
    });
  }

  function actualizarLinea(
    indiceCuenta: number,
    lado: LadoMayor,
    indiceLinea: number,
    cambios: Partial<LineaLibroMayor>
  ) {
    const cuenta = contenido.cuentas[indiceCuenta];

    if (!cuenta) {
      return;
    }

    if (lado === 'DEBE') {
      const debe = cuenta.debe.map((linea, index) =>
        index === indiceLinea
          ? {
              ...linea,
              ...cambios,
            }
          : linea
      );

      actualizarCuenta(indiceCuenta, {
        ...cuenta,
        debe,
      });

      return;
    }

    const haber = cuenta.haber.map((linea, index) =>
      index === indiceLinea
        ? {
            ...linea,
            ...cambios,
          }
        : linea
    );

    actualizarCuenta(indiceCuenta, {
      ...cuenta,
      haber,
    });
  }

  function eliminarLinea(indiceCuenta: number, lado: LadoMayor, indiceLinea: number) {
    const cuenta = contenido.cuentas[indiceCuenta];

    if (!cuenta) {
      return;
    }

    if (lado === 'DEBE') {
      actualizarCuenta(indiceCuenta, {
        ...cuenta,
        debe: cuenta.debe.filter((_, index) => index !== indiceLinea),
      });

      return;
    }

    actualizarCuenta(indiceCuenta, {
      ...cuenta,
      haber: cuenta.haber.filter((_, index) => index !== indiceLinea),
    });
  }

  function cambiarContracuenta(
    indiceCuenta: number,
    lado: LadoMayor,
    indiceLinea: number,
    idContraCuenta: number
  ) {
    const contraCuenta = cuentasContables.find((cuenta) => cuenta.idCuenta === idContraCuenta);

    actualizarLinea(indiceCuenta, lado, indiceLinea, {
      idContraCuenta: contraCuenta?.idCuenta ?? 0,
      contraCuenta: contraCuenta?.nombre ?? '',
    });
  }

  function cambiarTipoSaldo(indiceCuenta: number, tipoSaldo: TipoSaldoMayor | null) {
    const cuenta = contenido.cuentas[indiceCuenta];

    if (!cuenta) {
      return;
    }

    actualizarCuenta(indiceCuenta, {
      ...cuenta,
      tipoSaldo,
    });
  }

  function mostrarSelectorNuevaCuenta() {
    setMostrarNuevaCuenta(true);
  }

  return (
    <div className="space-y-5">
      {/* Acción superior */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          label="Agregar cuenta"
          icon={<CirclePlus size={15} />}
          onClick={mostrarSelectorNuevaCuenta}
          disabled={cargandoCuentas || cuentasDisponibles.length === 0}
          className="!rounded-lg !px-4 !py-2 !text-xs"
        />
      </div>

      {/* Estado vacío */}
      {contenido.cuentas.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-700">Todavía no hay cuentas mayorizadas.</p>

          <p className="mt-1 text-xs text-gray-500">
            Seleccioná una cuenta del Plan de Cuentas para comenzar.
          </p>
        </div>
      )}

      {/* Tarjetas: DOS cuentas por fila */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {contenido.cuentas.map((cuenta, indiceCuenta) => {
          const totales = calcularTotales(cuenta);

          const cuentaContable = cuentasContables.find((item) => item.idCuenta === cuenta.idCuenta);

          const tipoCuenta =
            cuentaContable?.rubro.tipoCuenta.nombre ??
            cuentaContable?.rubro.tipoCuenta.abreviatura ??
            '';

          return (
            <div
              key={`${cuenta.idCuenta}-${indiceCuenta}`}
              className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Cabecera cuenta */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three text-[10px] font-semibold text-white">
                    {indiceCuenta + 1}
                  </div>

                  <p className="truncate text-sm font-semibold text-gray-900">{cuenta.cuenta}</p>

                  {tipoCuenta && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium capitalize text-green-700">
                      {tipoCuenta.toLowerCase()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => eliminarCuenta(indiceCuenta)}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Eliminar cuenta ${cuenta.cuenta}`}
                  title="Eliminar cuenta"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Cuenta T */}
              <div className="grid grid-cols-2 border-t border-gray-200">
                {/* DEBE */}
                <div className="min-w-0 border-r border-gray-300">
                  <div className="border-b border-gray-200 bg-green-50/50 py-2 text-center">
                    <span className="text-xs font-bold uppercase tracking-wide text-abacontex-primary">
                      Debe
                    </span>
                  </div>

                  <CabeceraMayor />

                  {cuenta.debe.map((linea, indiceLinea) => (
                    <LineaMayor
                      key={`debe-${indiceLinea}`}
                      linea={linea}
                      cuentaPrincipalId={cuenta.idCuenta}
                      cuentas={cuentasContables}
                      onChange={(cambios) =>
                        actualizarLinea(indiceCuenta, 'DEBE', indiceLinea, cambios)
                      }
                      onCambiarContracuenta={(idContraCuenta) =>
                        cambiarContracuenta(indiceCuenta, 'DEBE', indiceLinea, idContraCuenta)
                      }
                      onEliminar={() => eliminarLinea(indiceCuenta, 'DEBE', indiceLinea)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => agregarLinea(indiceCuenta, 'DEBE')}
                    className="flex cursor-pointer items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:text-abacontex-primary-three"
                  >
                    <CirclePlus size={12} />
                    Agregar línea
                  </button>
                </div>

                {/* HABER */}
                <div className="min-w-0">
                  <div className="border-b border-gray-200 bg-green-50/50 py-2 text-center">
                    <span className="text-xs font-bold uppercase tracking-wide text-abacontex-primary">
                      Haber
                    </span>
                  </div>

                  <CabeceraMayor />

                  {cuenta.haber.map((linea, indiceLinea) => (
                    <LineaMayor
                      key={`haber-${indiceLinea}`}
                      linea={linea}
                      cuentaPrincipalId={cuenta.idCuenta}
                      cuentas={cuentasContables}
                      onChange={(cambios) =>
                        actualizarLinea(indiceCuenta, 'HABER', indiceLinea, cambios)
                      }
                      onCambiarContracuenta={(idContraCuenta) =>
                        cambiarContracuenta(indiceCuenta, 'HABER', indiceLinea, idContraCuenta)
                      }
                      onEliminar={() => eliminarLinea(indiceCuenta, 'HABER', indiceLinea)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => agregarLinea(indiceCuenta, 'HABER')}
                    className="flex cursor-pointer items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:text-abacontex-primary-three"
                  >
                    <CirclePlus size={12} />
                    Agregar línea
                  </button>
                </div>
              </div>

              {/* Totales */}
              <div className="grid grid-cols-[0.9fr_0.9fr_0.9fr_1.55fr] border-t border-gray-300 bg-gray-50">
                <div className="border-r border-gray-300 px-2 py-2.5 text-center">
                  <p className="text-[10px] font-semibold text-gray-700">Total Debe</p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    $ {formatearImporte(totales.totalDebe)}
                  </p>
                </div>

                <div className="border-r border-gray-300 px-2 py-2.5 text-center">
                  <p className="text-[10px] font-semibold text-gray-700">Total Haber</p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    $ {formatearImporte(totales.totalHaber)}
                  </p>
                </div>

                <div className="border-r border-gray-300 px-2 py-2.5 text-center">
                  <p className="text-[10px] font-semibold text-gray-700">Saldo final</p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    $ {formatearImporte(totales.saldo)}
                  </p>
                </div>

                <div className="flex min-w-0 items-center px-2 py-2">
                  <select
                    value={cuenta.tipoSaldo ?? ''}
                    onChange={(event) =>
                      cambiarTipoSaldo(
                        indiceCuenta,
                        event.target.value ? (event.target.value as TipoSaldoMayor) : null
                      )
                    }
                    className="h-8 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2 text-[11px] text-gray-600 outline-none transition focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                  >
                    <option value="">Seleccione saldo</option>

                    <option value="DEUDOR">Deudor</option>

                    <option value="ACREEDOR">Acreedor</option>

                    <option value="SALDADA">Saldada</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nueva cuenta */}
      {mostrarNuevaCuenta && (
        <div className="w-full rounded-xl border border-dashed border-emerald-300 bg-white p-4 xl:max-w-[650px]">
          <div className="mb-3 flex items-center gap-2">
            <CirclePlus size={16} className="text-abacontex-primary-three" />

            <span className="text-sm font-semibold text-gray-800">Nueva cuenta</span>

            <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-600">
              En edición
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Seleccionar cuenta del plan de cuentas <span className="text-red-500">*</span>
              </label>

              <SelectorCuentaContable
                cuentas={cuentasDisponibles}
                disabled={cargandoCuentas || cuentasDisponibles.length === 0}
                placeholder={
                  cargandoCuentas
                    ? 'Cargando cuentas...'
                    : cuentasDisponibles.length === 0
                      ? 'No hay cuentas disponibles'
                      : 'Buscar cuenta por código o nombre...'
                }
                onSelect={(idCuenta) => {
                  agregarCuenta(idCuenta);
                  setMostrarNuevaCuenta(false);
                }}
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5">
              <Info size={15} className="shrink-0 text-abacontex-primary-three" />

              <p className="text-xs leading-5 text-gray-600">
                Seleccioná una cuenta del plan de cuentas para agregar una nueva tarjeta al libro
                mayor.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CABECERA DE DEBE / HABER
============================================================ */

function CabeceraMayor() {
  return (
    <div className="grid grid-cols-[94px_minmax(0,1fr)_88px_34px] border-b border-gray-200 text-[11px] font-semibold text-gray-700">
      <div className="px-1.5 py-2 text-center">Fecha</div>

      <div className="border-l border-gray-200 px-1.5 py-2 text-center">Contra cuenta</div>

      <div className="border-l border-gray-200 px-1.5 py-2 text-center">Monto</div>

      <div className="border-l border-gray-200" />
    </div>
  );
}

interface LineaMayorProps {
  linea: LineaLibroMayor;
  cuentaPrincipalId: number;
  cuentas: CuentaContableEjercicio[];
  onChange: (cambios: Partial<LineaLibroMayor>) => void;
  onCambiarContracuenta: (idContraCuenta: number) => void;
  onEliminar: () => void;
}

function LineaMayor({
  linea,
  cuentaPrincipalId,
  cuentas,
  onChange,
  onCambiarContracuenta,
  onEliminar,
}: LineaMayorProps) {
  const cuentasContrapartida = cuentas.filter((cuenta) => cuenta.idCuenta !== cuentaPrincipalId);

  return (
    <div className="grid grid-cols-[94px_minmax(0,1fr)_88px_34px] items-center border-b border-gray-200">
      {/* Fecha */}
      <div className="min-w-0 p-1">
        <input
          type="date"
          value={fechaApiAInput(linea.fecha)}
          onChange={(event) =>
            onChange({
              fecha: fechaInputAApi(event.target.value),
            })
          }
          className="h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
        />
      </div>

      {/* Contracuenta */}
      <div className="min-w-0 border-l border-gray-200 p-1">
        <SelectorCuentaContable
          cuentas={cuentasContrapartida}
          value={linea.idContraCuenta || null}
          placeholder="Buscar contracuenta..."
          onSelect={onCambiarContracuenta}
        />
      </div>

      {/* Monto */}
      <div className="min-w-0 border-l border-gray-200 p-1">
        <input
          type="number"
          min="0"
          step="0.01"
          value={linea.monto === 0 ? '' : linea.monto}
          onChange={(event) =>
            onChange({
              monto: event.target.value === '' ? 0 : Number(event.target.value),
            })
          }
          onKeyDown={(event) => {
            if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
              event.preventDefault();
            }
          }}
          placeholder="0,00"
          className="h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-1.5 text-right text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
        />
      </div>

      {/* Eliminar */}
      <div className="flex h-full min-w-0 items-center justify-center border-l border-gray-200">
        <button
          type="button"
          onClick={onEliminar}
          className="flex size-7 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Eliminar movimiento"
          title="Eliminar movimiento"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
