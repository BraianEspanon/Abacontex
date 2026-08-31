import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useCategoriasFinancieras } from '../../hooks/useCategoriasFinancieras';
import { useMetodosPago } from '../../hooks/useMetodosPago';
import { useRegistrarMovimientoFinanciero } from '../../hooks/useRegistrarMovimientoFinanciero';

import type { RegistrarMovimientoRequest } from '../../types/finanzas.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrado?: () => void;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

const movimientoFormSchema = z.object({
  tipoMovimiento: z.enum(['INGRESO', 'EGRESO'], {
    error: 'Seleccioná un tipo de movimiento.',
  }),

  fecha: z.string().min(1, 'La fecha es obligatoria.'),

  idCategoria: z
    .number({
      error: 'Seleccioná una categoría.',
    })
    .int()
    .positive('Seleccioná una categoría.'),

  concepto: z.string().trim().min(1, 'El concepto es obligatorio.'),

  importe: z
    .number({
      error: 'El importe es obligatorio.',
    })
    .finite('El importe debe ser válido.')
    .positive('El importe debe ser mayor a cero.'),

  idMetodoPago: z
    .number({
      error: 'Seleccioná un método de pago.',
    })
    .int()
    .positive('Seleccioná un método de pago.'),
});

type MovimientoFormValues = z.infer<typeof movimientoFormSchema>;

function obtenerFechaActualInput() {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export default function RegistrarMovimientoModal({ isOpen, onClose, onRegistrado }: Props) {
  if (!isOpen) {
    return null;
  }

  return <RegistrarMovimientoModalContenido onClose={onClose} onRegistrado={onRegistrado} />;
}

interface ContenidoProps {
  onClose: () => void;
  onRegistrado?: () => void;
}

function RegistrarMovimientoModalContenido({ onClose, onRegistrado }: ContenidoProps) {
  const [errorApi, setErrorApi] = useState('');

  const {
    data: categorias,
    isLoading: cargandoCategorias,
    isError: errorCategorias,
  } = useCategoriasFinancieras(true);

  const {
    data: metodosPago = [],
    isLoading: cargandoMetodosPago,
    isError: errorMetodosPago,
  } = useMetodosPago(true);

  const registrarMovimientoMutation = useRegistrarMovimientoFinanciero();

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    control,
    formState: { errors },
  } = useForm<MovimientoFormValues>({
    resolver: zodResolver(movimientoFormSchema),
    defaultValues: {
      tipoMovimiento: 'INGRESO',
      fecha: obtenerFechaActualInput(),
      concepto: '',
      importe: 0,
    },
  });

  const tipoMovimiento = useWatch({
    control,
    name: 'tipoMovimiento',
  });

  const categoriasDisponibles = useMemo(() => {
    if (!categorias) {
      return [];
    }

    return tipoMovimiento === 'INGRESO' ? (categorias.ingreso ?? []) : (categorias.egreso ?? []);
  }, [categorias, tipoMovimiento]);

  const handleCambiarTipoMovimiento = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = event.target.value as 'INGRESO' | 'EGRESO';

    setValue('tipoMovimiento', nuevoTipo, {
      shouldValidate: true,
      shouldDirty: true,
    });

    resetField('idCategoria');
  };

  const handleCerrar = () => {
    if (registrarMovimientoMutation.isPending) {
      return;
    }

    onClose();
  };

  const onSubmit = async (data: MovimientoFormValues) => {
    setErrorApi('');

    /*
     * El input type="date" devuelve YYYY-MM-DD.
     *
     * Lo convertimos a una fecha local a las 00:00 y después
     * a ISO para cumplir con el validator datetime() del backend.
     */
    const fechaSeleccionada = new Date(`${data.fecha}T00:00:00`);

    if (Number.isNaN(fechaSeleccionada.getTime())) {
      setErrorApi('La fecha ingresada no es válida.');
      return;
    }

    const payload: RegistrarMovimientoRequest = {
      fecha: fechaSeleccionada.toISOString(),
      idCategoria: data.idCategoria,
      concepto: data.concepto.trim(),
      importe: data.importe,
      idMetodoPago: data.idMetodoPago,
    };

    try {
      await registrarMovimientoMutation.mutateAsync(payload);

      onRegistrado?.();
      onClose();
    } catch (error) {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        setErrorApi('Ocurrió un error inesperado. Intentá nuevamente.');
        return;
      }

      setErrorApi(
        error.response?.data?.message ??
          error.response?.data?.error ??
          'No se pudo registrar el movimiento financiero.'
      );
    }
  };

  const cargandoCatalogos = cargandoCategorias || cargandoMetodosPago;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[1px]">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-heading text-xl font-bold text-abacontex-black-text">
            Registrar movimiento financiero
          </h2>

          <button
            type="button"
            onClick={handleCerrar}
            disabled={registrarMovimientoMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6">
          {errorApi && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorApi}
            </div>
          )}

          {(errorCategorias || errorMetodosPago) && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              No se pudieron cargar los datos necesarios para registrar el movimiento.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="tipoMovimiento"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Tipo
              </label>

              <select
                id="tipoMovimiento"
                value={tipoMovimiento}
                onChange={handleCambiarTipoMovimiento}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary"
              >
                <option value="INGRESO">Ingreso</option>
                <option value="EGRESO">Egreso</option>
              </select>

              {errors.tipoMovimiento && (
                <p className="mt-1 text-xs text-red-600">{errors.tipoMovimiento.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="fechaMovimiento"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Fecha
              </label>

              <input
                id="fechaMovimiento"
                type="date"
                max={obtenerFechaActualInput()}
                {...register('fecha')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary"
              />

              {errors.fecha && <p className="mt-1 text-xs text-red-600">{errors.fecha.message}</p>}
            </div>
          </div>

          <div>
            <label
              htmlFor="categoriaMovimiento"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Categoría
            </label>

            <select
              id="categoriaMovimiento"
              disabled={cargandoCategorias}
              {...register('idCategoria', {
                setValueAs: (value) => (value === '' ? undefined : Number(value)),
              })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary disabled:bg-gray-100"
            >
              <option value="">
                {cargandoCategorias ? 'Cargando categorías...' : 'Seleccioná una categoría'}
              </option>

              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>

            {errors.idCategoria && (
              <p className="mt-1 text-xs text-red-600">{errors.idCategoria.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="conceptoMovimiento"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Concepto
            </label>

            <input
              id="conceptoMovimiento"
              type="text"
              placeholder="Descripción del movimiento"
              {...register('concepto')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-abacontex-primary"
            />

            {errors.concepto && (
              <p className="mt-1 text-xs text-red-600">{errors.concepto.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="importeMovimiento"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Importe ($)
              </label>

              <input
                id="importeMovimiento"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                {...register('importe', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-abacontex-primary"
              />

              {errors.importe && (
                <p className="mt-1 text-xs text-red-600">{errors.importe.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="metodoPagoMovimiento"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Método de pago
              </label>

              <select
                id="metodoPagoMovimiento"
                disabled={cargandoMetodosPago}
                {...register('idMetodoPago', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary disabled:bg-gray-100"
              >
                <option value="">
                  {cargandoMetodosPago ? 'Cargando métodos...' : 'Seleccioná un método'}
                </option>

                {metodosPago.map((metodo) => (
                  <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>

              {errors.idMetodoPago && (
                <p className="mt-1 text-xs text-red-600">{errors.idMetodoPago.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleCerrar}
              disabled={registrarMovimientoMutation.isPending}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                registrarMovimientoMutation.isPending ||
                cargandoCatalogos ||
                errorCategorias ||
                errorMetodosPago
              }
              className="inline-flex items-center gap-2 rounded-lg bg-abacontex-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {registrarMovimientoMutation.isPending ? 'Guardando...' : 'Guardar movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
