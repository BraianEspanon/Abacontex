import { AlertTriangle, X } from 'lucide-react';

import type { ProductoListado } from '../../types/producto.types';

interface EliminarProductoModalProps {
  producto: ProductoListado;
  isPending: boolean;
  isError: boolean;
  onConfirmar: () => void;
  onClose: () => void;
}

export default function EliminarProductoModal({
  producto,
  isPending,
  isError,
  onConfirmar,
  onClose,
}: EliminarProductoModalProps) {
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

          {isError && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              No fue posible eliminar el producto. Intentá nuevamente.
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
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Eliminando...' : 'Eliminar producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
