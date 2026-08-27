import axios from 'axios';
import { AlertTriangle, X } from 'lucide-react';

import type { ProductoListado } from '../../types/producto.types';

interface ErrorResponse {
  message?: string;
  error?: string;
  code?: string;
}

interface EliminarProductoModalProps {
  producto: ProductoListado;
  isPending: boolean;
  error: unknown;
  onConfirmar: () => void;
  onClose: () => void;
}

function obtenerMensajeError(error: unknown) {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return 'No fue posible eliminar el producto. Intentá nuevamente.';
  }

  const mensajeBackend = error.response?.data?.message ?? error.response?.data?.error;

  if (mensajeBackend) {
    return mensajeBackend;
  }

  return 'No fue posible eliminar el producto. Intentá nuevamente.';
}

export default function EliminarProductoModal({
  producto,
  isPending,
  error,
  onConfirmar,
  onClose,
}: EliminarProductoModalProps) {
  const mensajeError = error ? obtenerMensajeError(error) : null;

  const esConflicto = axios.isAxiosError<ErrorResponse>(error) && error.response?.status === 409;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="eliminar-producto-titulo"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2
            id="eliminar-producto-titulo"
            className="text-xl font-semibold text-abacontex-black-text"
          >
            Eliminar producto
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <p className="font-medium text-gray-900">¿Querés eliminar este producto?</p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Se eliminará <span className="font-semibold text-gray-900">{producto.nombre}</span>{' '}
                del catálogo de la empresa.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {mensajeError && (
            <div
              role="alert"
              className={`mt-5 rounded-lg border px-4 py-3 ${
                esConflicto ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex gap-3">
                <AlertTriangle
                  size={18}
                  className={`mt-0.5 shrink-0 ${esConflicto ? 'text-amber-600' : 'text-red-600'}`}
                />

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      esConflicto ? 'text-amber-800' : 'text-red-700'
                    }`}
                  >
                    {esConflicto
                      ? 'No se puede eliminar este producto'
                      : 'No fue posible eliminar el producto'}
                  </p>

                  <p
                    className={`mt-1 text-sm leading-5 ${
                      esConflicto ? 'text-amber-700' : 'text-red-600'
                    }`}
                  >
                    {mensajeError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {esConflicto ? 'Cerrar' : 'Cancelar'}
          </button>

          {!esConflicto && (
            <button
              type="button"
              onClick={onConfirmar}
              disabled={isPending}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Eliminando...' : 'Eliminar producto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
