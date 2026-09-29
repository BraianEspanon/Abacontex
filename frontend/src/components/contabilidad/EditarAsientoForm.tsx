import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../ui/Button';

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

      if (linea.idDetalle !== undefined) {
        detalle.idDetalle = linea.idDetalle;
      }

      return detalle;
    });

    onGuardar(detalles);
  };

  return (
    <div className="space-y-3">
      {/* Datos generales */}
      <section className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <div className="w-[95px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Fecha</label>

            <div className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs text-gray-500">
              {formatearFecha(fecha)}
            </div>
          </div>

          <div className="w-[95px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Nro. de asiento</label>

            <div className="rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-xs text-gray-500">
              {numeroAsiento}
            </div>
          </div>

          <div className="w-full sm:w-[300px]">
            <label className="mb-1 block text-xs font-medium text-gray-700">Concepto general</label>

            <div
              className="truncate rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-xs text-gray-500"
              title={conceptoGeneral}
            >
              {conceptoGeneral}
            </div>
          </div>
        </div>
      </section>

      {/* Asiento contable */}
      <section className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Asiento contable</h2>

        <div className="mx-auto max-w-[1050px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] overflow-hidden rounded-xl border border-gray-300 text-xs">
              {/* Cabecera */}
              <thead className="bg-[#a6c0a1] text-gray-900">
                <tr>
                  <th className="w-[100px] border-r border-[#8faa89] px-3 py-2 text-center font-medium">
                    Fecha
                  </th>

                  <th className="border-r border-[#8faa89] px-3 py-2 text-center font-medium">
                    Concepto
                  </th>

                  <th className="w-[90px] border-r border-[#8faa89] px-3 py-2 text-center font-medium">
                    N° Folio
                  </th>

                  <th className="w-[145px] border-r border-[#8faa89] px-3 py-2 text-center font-medium">
                    Debe
                  </th>

                  <th className="w-[145px] border-r border-[#8faa89] px-3 py-2 text-center font-medium">
                    Haber
                  </th>

                  {/* La columna de acciones también mantiene el fondo verde */}
                  <th className="w-10 px-2 py-2">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {lineas.map((linea) => {
                  const cuentaSeleccionada = obtenerCuenta(linea.cuentaId);

                  return (
                    <tr key={linea.idLocal} className="border-b border-gray-200 last:border-b-0">
                      {/* Fecha */}
                      <td className="border-r border-gray-200 px-3 py-2 text-center text-gray-700">
                        {formatearFecha(fecha)}
                      </td>

                      {/* Cuenta + movimiento */}
                      <td className="border-r border-gray-200 px-2 py-1.5">
                        <div className="flex gap-1.5">
                          <select
                            value={linea.cuentaId ?? ''}
                            onChange={(event) =>
                              handleCambiarCuenta(linea.idLocal, event.target.value)
                            }
                            disabled={enviando}
                            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-[#6f9468] focus:ring-1 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                          >
                            <option value="">Seleccionar cuenta</option>

                            {cuentas.map((cuenta) => (
                              <option key={cuenta.idCuenta} value={cuenta.idCuenta}>
                                {cuenta.codigo} - {cuenta.nombre}
                              </option>
                            ))}
                          </select>

                          <select
                            value={linea.movimiento}
                            onChange={(event) =>
                              handleCambiarMovimiento(linea.idLocal, event.target.value)
                            }
                            disabled={enviando}
                            aria-label="Movimiento contable"
                            className="w-[72px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-[#6f9468] focus:ring-1 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                          >
                            <option value="">...</option>

                            {tiposMovimiento.map((tipo) => (
                              <option key={tipo.codigo} value={tipo.codigo}>
                                {tipo.simbolo}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Folio */}
                      <td className="border-r border-gray-200 px-2 py-1.5 text-center text-gray-700">
                        {cuentaSeleccionada ? (cuentaSeleccionada.numeroFolio ?? 'Nuevo') : '—'}
                      </td>

                      {/* Debe */}
                      <td className="border-r border-gray-200 px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={linea.debe}
                          onChange={(event) => handleCambiarDebe(linea.idLocal, event.target.value)}
                          disabled={enviando}
                          placeholder="0,00"
                          className="w-full border-0 bg-transparent px-2 py-1 text-right text-xs outline-none focus:ring-0 disabled:bg-gray-50"
                        />
                      </td>

                      {/* Haber */}
                      <td className="border-r border-gray-200 px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={linea.haber}
                          onChange={(event) =>
                            handleCambiarHaber(linea.idLocal, event.target.value)
                          }
                          disabled={enviando}
                          placeholder="0,00"
                          className="w-full border-0 bg-transparent px-2 py-1 text-right text-xs outline-none focus:ring-0 disabled:bg-gray-50"
                        />
                      </td>

                      {/* Eliminar */}
                      <td className="bg-white px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleEliminarLinea(linea.idLocal)}
                          disabled={enviando}
                          title="Eliminar renglón"
                          aria-label="Eliminar renglón"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={2} className="px-3 py-2">
                    <button
                      type="button"
                      onClick={handleAgregarLinea}
                      disabled={enviando}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#496647] transition hover:text-[#365033] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar línea
                    </button>
                  </td>

                  <td className="px-3 py-2 text-right font-semibold text-gray-900">Total</td>

                  <td className="px-3 py-2 text-right font-semibold text-gray-900">
                    {formatearMoneda(totalDebe)}
                  </td>

                  <td className="px-3 py-2 text-right font-semibold text-gray-900">
                    {formatearMoneda(totalHaber)}
                  </td>

                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Estado del asiento */}
          <div className="mt-2 flex justify-end">
            <span
              className={[
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                balanceado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
              ].join(' ')}
            >
              {balanceado && <CheckCircle2 className="h-3.5 w-3.5" />}

              {balanceado ? 'Balanceado' : 'Desbalanceado'}
            </span>
          </div>

          {/* Error */}
          {errorFormulario && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700"
            >
              {errorFormulario}
            </div>
          )}

          {/* Acciones */}
          <div className="mt-3 flex justify-end gap-3">
            <Button
              type="button"
              label="Cancelar"
              variant="outline"
              onClick={onCancelar}
              disabled={enviando}
              className="rounded-md px-5 py-2 text-xs"
            />

            <Button
              type="button"
              label={enviando ? 'Guardando...' : 'Guardar cambios'}
              variant="solid"
              onClick={handleGuardar}
              disabled={enviando}
              className="rounded-md px-5 py-2 text-xs"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
