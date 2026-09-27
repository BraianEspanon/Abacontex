import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import type {
  CuentaContableConFolio,
  EditarAsientoDetalleRequest,
  MovimientoCuentaContable,
  RenglonAsientoEdicion,
  TipoMovimientoAsiento,
} from '../../types/contabilidad.types';

interface LineaAsientoEdicionForm {
  idLocal: string;
  idDetalle?: number;
  cuentaId: number | null;
  movimiento: MovimientoCuentaContable | '';
  debe: string;
  haber: string;
}

interface EditarAsientoFormProps {
  numeroAsiento: number;
  fecha: string;
  conceptoGeneral: string;
  detallesIniciales: RenglonAsientoEdicion[];
  cuentas: CuentaContableConFolio[];
  tiposMovimiento: TipoMovimientoAsiento[];
  enviando?: boolean;
  onCancelar: () => void;
  onGuardar: (detalles: EditarAsientoDetalleRequest[]) => void;
}

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(valor);

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(fecha));

function convertirImporte(valor: string) {
  if (valor.trim() === '') {
    return 0;
  }

  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
}

const crearLineaVacia = (): LineaAsientoEdicionForm => ({
  idLocal: crypto.randomUUID(),
  cuentaId: null,
  movimiento: '',
  debe: '',
  haber: '',
});

const convertirDetalleInicial = (detalle: RenglonAsientoEdicion): LineaAsientoEdicionForm => ({
  idLocal: `detalle-${detalle.idDetalle}`,
  idDetalle: detalle.idDetalle,
  cuentaId: detalle.cuentaId,
  movimiento: detalle.movimiento,
  debe: detalle.debe > 0 ? String(detalle.debe) : '',
  haber: detalle.haber > 0 ? String(detalle.haber) : '',
});

export default function EditarAsientoForm({
  numeroAsiento,
  fecha,
  conceptoGeneral,
  detallesIniciales,
  cuentas,
  tiposMovimiento,
  enviando = false,
  onCancelar,
  onGuardar,
}: EditarAsientoFormProps) {
  const [lineas, setLineas] = useState<LineaAsientoEdicionForm[]>(() =>
    detallesIniciales.map(convertirDetalleInicial)
  );

  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const totalDebe = useMemo(
    () => lineas.reduce((total, linea) => total + convertirImporte(linea.debe), 0),
    [lineas]
  );

  const totalHaber = useMemo(
    () => lineas.reduce((total, linea) => total + convertirImporte(linea.haber), 0),
    [lineas]
  );

  const balanceado = totalDebe > 0 && totalHaber > 0 && Math.abs(totalDebe - totalHaber) < 0.001;

  const actualizarLinea = (idLocal: string, cambios: Partial<LineaAsientoEdicionForm>) => {
    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.idLocal === idLocal
          ? {
              ...linea,
              ...cambios,
            }
          : linea
      )
    );

    setErrorFormulario(null);
  };

  const handleCambiarCuenta = (idLocal: string, valor: string) => {
    actualizarLinea(idLocal, {
      cuentaId: valor === '' ? null : Number(valor),
    });
  };

  const handleCambiarMovimiento = (idLocal: string, valor: string) => {
    actualizarLinea(idLocal, {
      movimiento: valor as MovimientoCuentaContable | '',
    });
  };

  const handleCambiarDebe = (idLocal: string, valor: string) => {
    if (valor !== '' && Number(valor) < 0) {
      return;
    }

    const cambios: Partial<LineaAsientoEdicionForm> = {
      debe: valor,
    };

    if (valor !== '' && Number(valor) > 0) {
      cambios.haber = '';
    }

    actualizarLinea(idLocal, cambios);
  };

  const handleCambiarHaber = (idLocal: string, valor: string) => {
    if (valor !== '' && Number(valor) < 0) {
      return;
    }

    const cambios: Partial<LineaAsientoEdicionForm> = {
      haber: valor,
    };

    if (valor !== '' && Number(valor) > 0) {
      cambios.debe = '';
    }

    actualizarLinea(idLocal, cambios);
  };

  const handleAgregarLinea = () => {
    setLineas((actuales) => [...actuales, crearLineaVacia()]);

    setErrorFormulario(null);
  };

  const handleEliminarLinea = (idLocal: string) => {
    if (lineas.length <= 2) {
      setErrorFormulario('El asiento debe contener al menos dos renglones.');
      return;
    }

    setLineas((actuales) => actuales.filter((linea) => linea.idLocal !== idLocal));

    setErrorFormulario(null);
  };

  const obtenerCuenta = (cuentaId: number | null) =>
    cuentas.find((cuenta) => cuenta.idCuenta === cuentaId);

  const validarFormulario = () => {
    if (lineas.length < 2) {
      return 'El asiento debe contener al menos dos renglones.';
    }

    for (const linea of lineas) {
      if (!linea.cuentaId) {
        return 'Seleccioná una cuenta contable en todos los renglones.';
      }

      if (!linea.movimiento) {
        return 'Seleccioná el movimiento contable en todos los renglones.';
      }

      const debe = convertirImporte(linea.debe);
      const haber = convertirImporte(linea.haber);

      if (debe <= 0 && haber <= 0) {
        return 'Cada renglón debe tener un importe en Debe o Haber.';
      }

      if (debe > 0 && haber > 0) {
        return 'Un renglón no puede tener importes en Debe y Haber al mismo tiempo.';
      }
    }

    if (!balanceado) {
      return 'El asiento debe estar balanceado antes de guardar los cambios.';
    }

    return null;
  };

  const handleGuardar = () => {
    const error = validarFormulario();

    if (error) {
      setErrorFormulario(error);
      return;
    }

    const detalles: EditarAsientoDetalleRequest[] = lineas.map((linea) => {
      const detalle: EditarAsientoDetalleRequest = {
        cuentaId: linea.cuentaId!,
        movimiento: linea.movimiento as MovimientoCuentaContable,
        debe: convertirImporte(linea.debe),
        haber: convertirImporte(linea.haber),
      };

      /*
       * Los renglones existentes conservan idDetalle.
       * Los nuevos no lo envían.
       */
      if (linea.idDetalle !== undefined) {
        detalle.idDetalle = linea.idDetalle;
      }

      return detalle;
    });

    onGuardar(detalles);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Datos del asiento</h2>

        <p className="mt-1 text-sm text-gray-500">
          Modificá los renglones contables del asiento seleccionado.
        </p>
      </div>

      <div className="space-y-5 p-5">
        {/* Datos generales */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">N° de asiento</label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {numeroAsiento}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Fecha</label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {formatearFecha(fecha)}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Concepto general
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {conceptoGeneral}
            </div>

            <p className="mt-1 text-xs text-gray-400">
              El concepto no puede modificarse desde esta pantalla.
            </p>
          </div>
        </div>

        {/* Renglones */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-3">Cuenta</th>

                <th className="px-3 py-3">Movimiento</th>

                <th className="px-3 py-3 text-center">N° Folio</th>

                <th className="px-3 py-3 text-right">Debe</th>

                <th className="px-3 py-3 text-right">Haber</th>

                <th className="w-14 px-3 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lineas.map((linea) => {
                const cuentaSeleccionada = obtenerCuenta(linea.cuentaId);

                return (
                  <tr key={linea.idLocal}>
                    <td className="min-w-[260px] px-3 py-3">
                      <select
                        value={linea.cuentaId ?? ''}
                        onChange={(event) => handleCambiarCuenta(linea.idLocal, event.target.value)}
                        disabled={enviando}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                      >
                        <option value="">Seleccionar cuenta</option>

                        {cuentas.map((cuenta) => (
                          <option key={cuenta.idCuenta} value={cuenta.idCuenta}>
                            {cuenta.codigo} - {cuenta.nombre}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="min-w-[230px] px-3 py-3">
                      <select
                        value={linea.movimiento}
                        onChange={(event) =>
                          handleCambiarMovimiento(linea.idLocal, event.target.value)
                        }
                        disabled={enviando}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                      >
                        <option value="">Seleccionar movimiento</option>

                        {tiposMovimiento.map((tipo) => (
                          <option key={tipo.codigo} value={tipo.codigo}>
                            {tipo.simbolo} - {tipo.nombre}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex min-w-14 justify-center rounded-md bg-gray-100 px-2 py-2 text-sm font-medium text-gray-700">
                        {cuentaSeleccionada
                          ? (cuentaSeleccionada.numeroFolio ?? 'Se asignará')
                          : '—'}
                      </span>
                    </td>

                    <td className="min-w-[150px] px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={linea.debe}
                        onChange={(event) => handleCambiarDebe(linea.idLocal, event.target.value)}
                        disabled={enviando}
                        placeholder="0,00"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                      />
                    </td>

                    <td className="min-w-[150px] px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={linea.haber}
                        onChange={(event) => handleCambiarHaber(linea.idLocal, event.target.value)}
                        disabled={enviando}
                        placeholder="0,00"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                      />
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEliminarLinea(linea.idLocal)}
                        disabled={enviando}
                        title="Eliminar renglón"
                        aria-label="Eliminar renglón"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Agregar línea */}
        <button
          type="button"
          onClick={handleAgregarLinea}
          disabled={enviando}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#496647] transition hover:bg-[#f1f5ef] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Agregar línea
        </button>

        {/* Totales */}
        <div className="ml-auto max-w-md rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Debe</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatearMoneda(totalDebe)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Total Haber</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatearMoneda(totalHaber)}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-3">
            <span
              className={[
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                balanceado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
              ].join(' ')}
            >
              {balanceado ? 'Asiento balanceado' : 'Asiento desbalanceado'}
            </span>
          </div>
        </div>

        {/* Error */}
        {errorFormulario && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorFormulario}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            disabled={enviando}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            disabled={enviando}
            className="rounded-lg bg-[#6f9468] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5f8059] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </section>
  );
}
