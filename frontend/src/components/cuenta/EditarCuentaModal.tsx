import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useActualizarCuenta } from '../../hooks/useActualizarCuenta';

import type { CuentaContable, EditarCuentaRequest } from '../../types/cuenta.types';

import { formatearNombreEnum } from '../../utils/texto.utils';

const editarCuentaSchema = z.object({
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

type EditarCuentaForm = z.infer<typeof editarCuentaSchema>;

interface EditarCuentaModalProps {
  abierto: boolean;
  cuenta: CuentaContable | null;
  onCerrar: () => void;
  onActualizada: () => void;
}

export default function EditarCuentaModal({
  abierto,
  cuenta,
  onCerrar,
  onActualizada,
}: EditarCuentaModalProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const { mutateAsync: actualizarCuenta, isPending } = useActualizarCuenta();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditarCuentaForm>({
    resolver: zodResolver(editarCuentaSchema),

    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  useEffect(() => {
    if (!abierto || !cuenta) {
      return;
    }

    reset({
      nombre: cuenta.nombre,
      descripcion: cuenta.descripcion,
    });

    setConfirmando(false);
    setErrorServidor(null);
  }, [abierto, cuenta, reset]);

  const nombre = watch('nombre');
  const descripcion = watch('descripcion');

  const cerrarModal = () => {
    if (isPending) {
      return;
    }

    reset({
      nombre: '',
      descripcion: '',
    });

    setConfirmando(false);
    setErrorServidor(null);

    onCerrar();
  };

  const solicitarConfirmacion = () => {
    setErrorServidor(null);
    setConfirmando(true);
  };

  const confirmarEdicion = async (form: EditarCuentaForm) => {
    if (!cuenta) {
      return;
    }

    const payload: EditarCuentaRequest = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
    };

    try {
      await actualizarCuenta({
        idCuenta: cuenta.idCuenta,
        datos: payload,
      });

      reset();
      setConfirmando(false);
      setErrorServidor(null);

      onActualizada();
      onCerrar();
    } catch (error) {
      setConfirmando(false);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 409) {
          setError('nombre', {
            type: 'server',
            message: 'Ya existe otra cuenta registrada con ese nombre.',
          });

          return;
        }

        if (status === 404) {
          setErrorServidor('La cuenta que intentás modificar ya no existe.');

          return;
        }

        if (status === 403) {
          setErrorServidor('No tenés permisos para modificar cuentas.');

          return;
        }

        if (status === 400) {
          setErrorServidor('Los datos ingresados no son válidos.');

          return;
        }
      }

      setErrorServidor('No se pudo modificar la cuenta. Intentá nuevamente.');
    }
  };

  if (!abierto || !cuenta) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-xl font-semibold text-gray-900">Editar cuenta</h2>

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

        <form onSubmit={handleSubmit(solicitarConfirmacion)} className="space-y-4 px-6 pb-6 pt-5">
          {/* Código + Tipo */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="codigoCuentaEditar"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Código
              </label>

              <input
                id="codigoCuentaEditar"
                type="text"
                value={cuenta.codigo}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="tipoCuentaEditar"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Tipo
              </label>

              <input
                id="tipoCuentaEditar"
                type="text"
                value={formatearNombreEnum(cuenta.rubro.tipoCuenta.nombre)}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Rubro */}
          <div>
            <label
              htmlFor="rubroCuentaEditar"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Rubro
            </label>

            <input
              id="rubroCuentaEditar"
              type="text"
              value={cuenta.rubro.nombre}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          {/* Nombre */}
          <div>
            <label
              htmlFor="nombreCuentaEditar"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Nombre <span className="text-red-500">*</span>
            </label>

            <input
              id="nombreCuentaEditar"
              type="text"
              maxLength={100}
              placeholder="Nombre de la cuenta"
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
              htmlFor="descripcionCuentaEditar"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Descripción <span className="text-red-500">*</span>
            </label>

            <textarea
              id="descripcionCuentaEditar"
              rows={4}
              maxLength={255}
              placeholder="Descripción de la cuenta"
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

          {errorServidor && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorServidor}
            </div>
          )}

          {/* Acciones */}
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
              className="inline-flex items-center gap-2 rounded-lg bg-[#6f9468] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#5f8259] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </button>
          </div>
        </form>

        {/* Confirmación */}
        {confirmando && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/30 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar modificación</h3>

              <p className="mt-2 text-sm text-gray-600">
                ¿Deseás guardar los cambios realizados en esta cuenta?
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
                    void handleSubmit(confirmarEdicion)();
                  }}
                  className="rounded-lg bg-[#6f9468] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5f8259] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? 'Guardando...' : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
