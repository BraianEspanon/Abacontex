import { X } from 'lucide-react';

import type { Producto } from '../../types/producto.types';

interface DetalleProductoModalProps {
  producto: Producto;
  onClose: () => void;
}

export default function DetalleProductoModal({ producto, onClose }: DetalleProductoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold">Detalle del producto</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex gap-6">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
              {producto.fotoUrl ? (
                <img
                  src={producto.fotoUrl}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">Sin imagen</span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>

                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">Precio unitario</p>

                <p className="font-medium">${producto.precioUnitario.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Stock disponible</p>

                <p className="font-medium">{producto.stock} unidades</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Estado</p>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    producto.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">Descripción</p>

            <div className="rounded-lg border bg-gray-50 p-4">{producto.descripcion}</div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#4f6f52] px-5 py-2.5 font-medium text-white transition hover:bg-[#405c43]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
