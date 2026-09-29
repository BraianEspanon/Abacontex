import { CheckCircle2, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../ui/Button';

import type {
  CuentaContableConFolio,
  MovimientoCuentaContable,
  RegistrarAsientoDetalleRequest,
  TipoMovimientoAsiento,
} from '../../types/contabilidad.types';

export interface LineaAsientoForm {
  id: string;
  cuentaId: number | null;
  movimiento: MovimientoCuentaContable | '';
  debe: string;
  haber: string;
}

interface AsientoContableFormProps {
  fecha: string;
  conceptoGeneral: string;
  onConceptoGeneralChange: (valor: string) => void;
  cuentas: CuentaContableConFolio[];
  tiposMovimiento: TipoMovimientoAsiento[];
  enviando?: boolean;
  onCancelar: () => void;
  onGuardar: (detalles: RegistrarAsientoDetalleRequest[]) => void;
}

const crearLineaVacia = (): LineaAsientoForm => ({
  id: crypto.randomUUID(),
  cuentaId: null,
  movimiento: '',
  debe: '',
  haber: '',
});

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

export default function AsientoContableForm({
  fecha,
  conceptoGeneral,
  onConceptoGeneralChange,
  cuentas,
  tiposMovimiento,
  enviando = false,
  onCancelar,
  onGuardar,
}: AsientoContableFormProps) {
  const [lineas, setLineas] = useState<LineaAsientoForm[]>([crearLineaVacia(), crearLineaVacia()]);

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

  const actualizarLinea = (id: string, cambios: Partial<LineaAsientoForm>) => {
    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id
          ? {
              ...linea,
              ...cambios,
            }
          : linea
      )
    );

    setErrorFormulario(null);
  };

  const handleCambiarCuenta = (id: string, valor: string) => {
    actualizarLinea(id, {
      cuentaId: valor === '' ? null : Number(valor),
    });
  };

  const handleCambiarMovimiento = (id: string, valor: string) => {
    actualizarLinea(id, {
      movimiento: valor as MovimientoCuentaContable | '',
    });
  };

  const handleCambiarDebe = (id: string, valor: string) => {
    if (valor !== '' && Number(valor) < 0) {
      return;
    }

    const cambios: Partial<LineaAsientoForm> = {
      debe: valor,
    };

    if (valor !== '' && Number(valor) > 0) {
      cambios.haber = '';
    }

    actualizarLinea(id, cambios);
  };

  const handleCambiarHaber = (id: string, valor: string) => {
    if (valor !== '' && Number(valor) < 0) {
      return;
    }

    const cambios: Partial<LineaAsientoForm> = {
      haber: valor,
    };

    if (valor !== '' && Number(valor) > 0) {
      cambios.debe = '';
    }

    actualizarLinea(id, cambios);
  };

  const handleAgregarLinea = () => {
    setLineas((actuales) => [...actuales, crearLineaVacia()]);
    setErrorFormulario(null);
  };

  const handleEliminarLinea = (id: string) => {
    if (lineas.length <= 2) {
      setErrorFormulario('El asiento debe contener al menos dos renglones.');
      return;
    }

    setLineas((actuales) => actuales.filter((linea) => linea.id !== id));
    setErrorFormulario(null);
  };

  const obtenerCuenta = (cuentaId: number | null) =>
    cuentas.find((cuenta) => cuenta.idCuenta === cuentaId);

  const validarFormulario = () => {
    if (!conceptoGeneral.trim()) {
      return 'Ingresá el concepto general del asiento.';
    }

    if (conceptoGeneral.trim().length > 255) {
      return 'El concepto general no puede superar los 255 caracteres.';
    }

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
      return 'El asiento debe estar balanceado antes de guardarse.';
    }

    return null;
  };

  const handleGuardar = () => {
    const error = validarFormulario();

    if (error) {
      setErrorFormulario(error);
      return;
    }

    const detalles: RegistrarAsientoDetalleRequest[] = lineas.map((linea) => ({
      cuentaId: linea.cuentaId!,
      movimiento: linea.movimiento as MovimientoCuentaContable,
      debe: convertirImporte(linea.debe),
      haber: convertirImporte(linea.haber),
    }));

    onGuardar(detalles);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Asiento contable</h2>

      <div className="mx-auto max-w-[1160px] overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
        {/* Datos generales */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 md:flex-row md:items-end">
          <div className="shrink-0 border-gray-300 md:border-r md:pr-4">
            <p className="text-[11px] font-medium text-gray-700">Asiento N°</p>

            <p
              className="mt-1 text-xs font-medium text-gray-800"
              title="El número de asiento será asignado automáticamente al guardar."
            >
              Se asignará al guardar
            </p>
          </div>

          <div className="shrink-0 border-gray-300 md:border-r md:px-4">
            <p className="text-[11px] font-medium text-gray-700">Fecha</p>

            <div className="mt-1 flex h-8 min-w-[110px] items-center rounded-md border border-gray-300 bg-gray-50 px-2.5 text-xs text-gray-700">
              {formatearFecha(fecha)}
            </div>
          </div>

          <div className="min-w-0 flex-1 md:pl-1">
            <label
              htmlFor="conceptoGeneral"
              className="mb-1 block text-[11px] font-medium text-gray-700"
            >
              Concepto
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="conceptoGeneral"
              type="text"
              maxLength={255}
              value={conceptoGeneral}
              onChange={(event) => {
                onConceptoGeneralChange(event.target.value);
                setErrorFormulario(null);
              }}
              placeholder="Descripción del asiento"
              disabled={enviando}
              className="h-8 w-full max-w-[430px] rounded-md border border-gray-300 bg-white px-2.5 text-xs outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed text-xs">
            <colgroup>
              <col className="w-[105px]" />
              <col />
              <col className="w-[90px]" />
              <col className="w-[155px]" />
              <col className="w-[155px]" />
              <col className="w-[48px]" />
            </colgroup>

            <thead className="bg-[#9fba9a] text-gray-900">
              <tr>
                <th className="px-3 py-2 text-center font-medium">Fecha</th>

                <th className="px-3 py-2 text-center font-medium">Concepto</th>

                <th className="px-3 py-2 text-center font-medium">N° Folio</th>

                <th className="px-3 py-2 text-center font-medium">Debe</th>

                <th className="px-3 py-2 text-center font-medium">Haber</th>

                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {lineas.map((linea) => {
                const cuentaSeleccionada = obtenerCuenta(linea.cuentaId);

                return (
                  <tr key={linea.id} className="border-b border-gray-200 last:border-b-0">
                    {/* Fecha */}
                    <td className="border-r border-gray-200 px-3 py-1.5 text-center text-xs text-gray-700">
                      {formatearFecha(fecha)}
                    </td>

                    {/* Cuenta + movimiento */}
                    <td className="border-r border-gray-200 px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={linea.cuentaId ?? ''}
                          onChange={(event) => handleCambiarCuenta(linea.id, event.target.value)}
                          disabled={enviando}
                          className="h-8 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 text-xs outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
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
                            handleCambiarMovimiento(linea.id, event.target.value)
                          }
                          disabled={enviando}
                          className="h-8 w-[82px] shrink-0 rounded-md border border-gray-300 bg-white px-2 text-xs outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
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
                    <td className="border-r border-gray-200 px-2 py-1.5 text-center">
                      <span
                        title={
                          cuentaSeleccionada?.numeroFolio == null
                            ? 'El folio será asignado automáticamente al guardar el asiento.'
                            : undefined
                        }
                        className="text-xs font-medium text-gray-700"
                      >
                        {cuentaSeleccionada ? (cuentaSeleccionada.numeroFolio ?? 'Nuevo') : '—'}
                      </span>
                    </td>

                    {/* Debe */}
                    <td className="border-r border-gray-200 px-2 py-1.5">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={linea.debe}
                        onChange={(event) => handleCambiarDebe(linea.id, event.target.value)}
                        disabled={enviando}
                        placeholder="0,00"
                        className="h-8 w-full rounded-md border border-transparent bg-transparent px-2 text-right text-xs outline-none transition hover:border-gray-300 focus:border-abacontex-primary-three focus:bg-white focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
                      />
                    </td>

                    {/* Haber */}
                    <td className="border-r border-gray-200 px-2 py-1.5">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={linea.haber}
                        onChange={(event) => handleCambiarHaber(linea.id, event.target.value)}
                        disabled={enviando}
                        placeholder="0,00"
                        className="h-8 w-full rounded-md border border-transparent bg-transparent px-2 text-right text-xs outline-none transition hover:border-gray-300 focus:border-abacontex-primary-three focus:bg-white focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
                      />
                    </td>

                    {/* Eliminar */}
                    <td className="px-1 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleEliminarLinea(linea.id)}
                        disabled={enviando}
                        title="Eliminar renglón"
                        aria-label="Eliminar renglón"
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totales */}
            <tfoot>
              <tr className="border-t border-gray-300 bg-white">
                <td colSpan={3} className="px-3 py-2">
                  <button
                    type="button"
                    onClick={handleAgregarLinea}
                    disabled={enviando}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#496647] transition hover:text-[#365033] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar línea
                  </button>
                </td>

                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-800">Total</span>

                    <span className="font-semibold text-gray-900">
                      {formatearMoneda(totalDebe)}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 text-right font-semibold text-gray-900">
                  {formatearMoneda(totalHaber)}
                </td>

                <td className="px-1 py-2" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Estado del balance */}
        <div className="flex justify-end border-t border-gray-200 px-3 py-2">
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium',
              balanceado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
            ].join(' ')}
          >
            {balanceado ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" />
            )}

            {balanceado ? 'Balanceado' : 'Desbalanceado'}
          </span>
        </div>
      </div>

      {/* Error */}
      {errorFormulario && (
        <div
          role="alert"
          className="mx-auto mt-3 max-w-[1160px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {errorFormulario}
        </div>
      )}

      {/* Acciones */}
      <div className="mx-auto mt-3 flex max-w-[1160px] justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          variant="outline"
          onClick={onCancelar}
          disabled={enviando}
          className="rounded-md px-4 py-2 text-xs"
        />

        <Button
          type="button"
          label={enviando ? 'Guardando...' : 'Guardar asiento'}
          variant="solid"
          onClick={handleGuardar}
          disabled={enviando}
          className="rounded-md px-4 py-2 text-xs"
        />
      </div>
    </section>
  );
}
