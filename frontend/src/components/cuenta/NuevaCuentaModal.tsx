import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCrearCuenta } from '../../hooks/useCrearCuenta';

import type { RegistrarCuentaRequest, TipoCuentaConRubros } from '../../types/cuenta.types';

import { formatearNombreEnum } from '../../utils/texto.utils';

const registrarCuentaSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(1, 'El código es obligatorio')
    .max(20, 'El código no puede superar los 20 caracteres'),

  tipoCuentaId: z.string().min(1, 'Debe seleccionar un tipo'),

  idRubro: z.string().min(1, 'Debe seleccionar un rubro'),

  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  descripcion: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(255, 'La descripción no puede superar los 255 caracteres'),
});

type RegistrarCuentaForm = z.infer<typeof registrarCuentaSchema>;

interface NuevaCuentaModalProps {
  abierto: boolean;
  tiposCuenta: TipoCuentaConRubros[];
  onCerrar: () => void;
  onCreada: () => void;
}

export default function NuevaCuentaModal({
  abierto,
  tiposCuenta,
  onCerrar,
  onCreada,
}: NuevaCuentaModalProps) {
  const [confirmando, setConfirmando] = useState(false);

  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const { mutateAsync: crearCuenta, isPending } = useCrearCuenta();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrarCuentaForm>({
    resolver: zodResolver(registrarCuentaSchema),

    defaultValues: {
      codigo: '',
      tipoCuentaId: '',
      idRubro: '',
      nombre: '',
      descripcion: '',
    },
  });

  const tipoCuentaId = watch('tipoCuentaId');
  const idRubro = watch('idRubro');
  const nombre = watch('nombre');
  const descripcion = watch('descripcion');

  const rubrosDisponibles = useMemo(() => {
    if (!tipoCuentaId) {
      return [];
    }

    const tipoSeleccionado = tiposCuenta.find((tipo) => tipo.idTipoCuenta === Number(tipoCuentaId));

    return tipoSeleccionado?.rubros ?? [];
  }, [tipoCuentaId, tiposCuenta]);

  const cerrarModal = () => {
    if (isPending) {
      return;
    }

    reset();
    setConfirmando(false);
    setErrorServidor(null);

    onCerrar();
  };

  const solicitarConfirmacion = () => {
    setErrorServidor(null);
    setConfirmando(true);
  };

  const confirmarCreacion = async (form: RegistrarCuentaForm) => {
    const payload: RegistrarCuentaRequest = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      idRubro: Number(form.idRubro),
      descripcion: form.descripcion.trim(),
    };

    try {
      await crearCuenta(payload);

      reset();
      setConfirmando(false);
      setErrorServidor(null);

      onCreada();
      onCerrar();
    } catch (error) {
      setConfirmando(false);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 409) {
          setErrorServidor('Ya existe una cuenta registrada con el código o nombre ingresado.');

          return;
        }

        if (status === 404) {
          setErrorServidor('El rubro seleccionado ya no se encuentra disponible.');

          return;
        }

        if (status === 403) {
          setErrorServidor('No tenés permisos para registrar cuentas.');

          return;
        }
      }

      setErrorServidor('No se pudo crear la cuenta. Intentá nuevamente.');
    }
  };

  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-xl font-semibold text-gray-900">Nueva cuenta contable</h2>

          <button
            type="button"
            onClick={cerrarModal}
            disabled={isPending}
            aria-label="Cerrar modal"
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(solicitarConfirmacion)} className="space-y-4 px-6 pb-6 pt-5">
          {/* Código y Tipo */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Código */}
            <div>
              <label
                htmlFor="codigoCuenta"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Código <span className="text-red-500">*</span>
              </label>

              <input
                id="codigoCuenta"
                type="text"
                placeholder="Ej. 1.1.1"
                maxLength={20}
                {...register('codigo')}
                className={[
                  'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                  errors.codigo
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                ].join(' ')}
              />

              {errors.codigo && (
                <p className="mt-1 text-xs text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label
                htmlFor="tipoCuentaNueva"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Tipo <span className="text-red-500">*</span>
              </label>

              <select
                id="tipoCuentaNueva"
                value={tipoCuentaId}
                onChange={(event) => {
                  setValue('tipoCuentaId', event.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  /*
                   * Si cambia el tipo, el rubro anterior
                   * deja de ser válido hasta seleccionar
                   * uno perteneciente al nuevo tipo.
                   */
                  setValue('idRubro', '', {
                    shouldValidate: false,
                    shouldDirty: true,
                  });
                }}
                className={[
                  'w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition',
                  errors.tipoCuentaId
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                ].join(' ')}
              >
                <option value="">Seleccione una opción</option>

                {tiposCuenta.map((tipo) => (
                  <option key={tipo.idTipoCuenta} value={String(tipo.idTipoCuenta)}>
                    {formatearNombreEnum(tipo.nombre)}
                  </option>
                ))}
              </select>

              {errors.tipoCuentaId && (
                <p className="mt-1 text-xs text-red-600">{errors.tipoCuentaId.message}</p>
              )}
            </div>
          </div>

          {/* Rubro */}
          <div>
            <label
              htmlFor="rubroCuentaNueva"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Rubro <span className="text-red-500">*</span>
            </label>

            <select
              id="rubroCuentaNueva"
              value={idRubro}
              disabled={!tipoCuentaId}
              onChange={(event) => {
                setValue('idRubro', event.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className={[
                'w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                errors.idRubro
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
              ].join(' ')}
            >
              <option value="">Seleccione una opción</option>

              {rubrosDisponibles.map((rubro) => (
                <option key={rubro.idRubro} value={String(rubro.idRubro)}>
                  {rubro.nombre}
                </option>
              ))}
            </select>

            {errors.idRubro && (
              <p className="mt-1 text-xs text-red-600">{errors.idRubro.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label
              htmlFor="nombreCuentaNueva"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Nombre <span className="text-red-500">*</span>
            </label>

            <input
              id="nombreCuentaNueva"
              type="text"
              placeholder="Nombre de la cuenta"
              maxLength={100}
              {...register('nombre')}
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                errors.nombre
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
              ].join(' ')}
            />

            <div className="mt-1 flex justify-between">
              <span className="text-xs text-gray-500">Máx. 100 caracteres</span>

              <span className="text-xs text-gray-500">{nombre.length}/100</span>
            </div>

            {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcionCuentaNueva"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Descripción <span className="text-red-500">*</span>
            </label>

            <textarea
              id="descripcionCuentaNueva"
              rows={4}
              placeholder="Descripción de la cuenta"
              maxLength={255}
              {...register('descripcion')}
              className={[
                'w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition',
                errors.descripcion
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
              ].join(' ')}
            />

            <div className="mt-1 flex justify-between">
              <span className="text-xs text-gray-500">Máx. 255 caracteres</span>

              <span className="text-xs text-gray-500">{descripcion.length}/255</span>
            </div>

            {errors.descripcion && (
              <p className="mt-1 text-xs text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Error servidor */}
          {errorServidor && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorServidor}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={cerrarModal}
              disabled={isPending}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#6f9468] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#5f8259] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Crear cuenta
            </button>
          </div>
        </form>

        {/* Modal de confirmación */}
        {confirmando && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/30 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar creación</h3>

              <p className="mt-2 text-sm text-gray-600">
                ¿Deseás registrar esta nueva cuenta contable?
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setConfirmando(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    void handleSubmit(confirmarCreacion)();
                  }}
                  className="rounded-lg bg-[#6f9468] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5f8259] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? 'Creando...' : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
