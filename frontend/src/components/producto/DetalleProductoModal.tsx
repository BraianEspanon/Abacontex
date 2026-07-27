import { BadgeCheck, BadgeDollarSign, Boxes, ImageOff, Pencil, X } from 'lucide-react';

import type { Producto } from '../../types/producto.types';

interface DetalleProductoModalProps {
  producto: Producto;
  onClose: () => void;
  onEditar: (productoId: number) => void;
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
}

export default function DetalleProductoModal({
  producto,
  onClose,
  onEditar,
}: DetalleProductoModalProps) {
  const tieneStock = producto.stock > 0;

  const handleEditar = () => {
    onEditar(producto.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-detalle-producto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between px-6 pt-5">
          <h2 id="titulo-detalle-producto" className="text-lg font-bold text-gray-950">
            Detalle del producto
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle del producto"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={19} />
          </button>
        </header>

        <div className="grid gap-6 px-6 py-5 md:grid-cols-[160px_minmax(0,1fr)]">
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-[#f7f6f2] md:h-40">
            {producto.fotoUrl ? (
              <img
                src={producto.fotoUrl}
                alt={producto.nombre}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400">
                <ImageOff size={34} strokeWidth={1.6} />

                <span className="mt-2 text-xs">Sin imagen disponible</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-950">{producto.nombre}</h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
              {producto.descripcion}
            </p>

            <dl className="mt-4 space-y-3">
              <div className="grid grid-cols-[1fr_auto] items-center gap-5">
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <BadgeDollarSign size={15} className="shrink-0 text-gray-700" />
                  Precio unitario
                </dt>

                <dd className="text-right text-xs font-semibold text-gray-950">
                  {formatearPrecio(producto.precioUnitario)}
                </dd>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-5">
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <Boxes size={15} className="shrink-0 text-gray-700" />
                  Stock disponible
                </dt>

                <dd className="text-right text-xs font-medium text-gray-950">
                  {producto.stock} unidades
                </dd>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-5">
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <BadgeCheck size={15} className="shrink-0 text-gray-700" />
                  Estado
                </dt>

                <dd>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      tieneStock ? 'bg-[#eaf4e9] text-[#4f6f52]' : 'bg-[#fce9e8] text-[#b84545]'
                    }`}
                  >
                    {tieneStock ? 'Con stock' : 'Sin stock'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-w-28 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleEditar}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-[#769a75] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#638563]"
          >
            <Pencil size={14} />
            Editar producto
          </button>
        </footer>
      </div>
    </div>
  );
}
