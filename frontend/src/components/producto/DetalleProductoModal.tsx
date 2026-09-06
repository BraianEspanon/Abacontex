import { CalendarClock, ImageOff, Package, Pencil, Tag, X } from 'lucide-react';

import type { Producto } from '../../types/producto.types';

interface DetalleProductoModalProps {
  producto: Producto;
  onClose: () => void;
  onEditar: (productoId: number) => void;
}

function formatearPrecio(precio: number) {
  const valor = Number(precio);

  if (!Number.isFinite(valor)) {
    return '$ 0,00';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatearFecha(fecha: string) {
  const fechaDate = new Date(fecha);

  if (Number.isNaN(fechaDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fechaDate);
}

export default function DetalleProductoModal({
  producto,
  onClose,
  onEditar,
}: DetalleProductoModalProps) {
  const tieneStock = producto.stock > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-producto-titulo"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 id="detalle-producto-titulo" className="text-xl font-bold text-gray-950">
            Detalle del producto
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="grid gap-7 px-6 py-5 sm:grid-cols-[180px_minmax(0,1fr)]">
          {/* Imagen */}
          <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#f3f3f1]">
            {producto.fotoUrl ? (
              <img
                src={producto.fotoUrl}
                alt={producto.nombre}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <ImageOff size={48} strokeWidth={1.4} />

                <span className="text-xs text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-950">{producto.nombre}</h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">{producto.descripcion}</p>

            <div className="mt-5 space-y-5">
              {/* Precio venta */}
              <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2">
                <Tag size={18} strokeWidth={1.8} className="text-gray-800" />

                <span className="text-sm font-medium text-gray-800">Precio de venta</span>

                <span className="text-sm font-medium text-gray-950">
                  {formatearPrecio(producto.precioVenta)}
                </span>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2">
                <Package size={18} strokeWidth={1.8} className="text-gray-800" />

                <span className="text-sm font-medium text-gray-800">Stock disponible</span>

                <span className="text-sm text-gray-950">
                  {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
                </span>
              </div>

              {/* Estado */}
              <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2">
                <Tag size={18} strokeWidth={1.8} className="text-gray-800" />

                <span className="text-sm font-medium text-gray-800">Estado</span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    tieneStock ? 'bg-[#eaf4e9] text-[#4f6f52]' : 'bg-[#fce9e8] text-[#b84545]'
                  }`}
                >
                  {tieneStock ? 'Con stock' : 'Sin stock'}
                </span>
              </div>

              {/* Fecha */}
              <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2">
                <CalendarClock size={18} strokeWidth={1.8} className="text-gray-800" />

                <span className="text-sm font-medium text-gray-800">Registrado el</span>

                <span className="text-sm text-gray-500">{formatearFecha(producto.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="min-w-28 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onEditar(producto.id)}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-[#769a75] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#638563]"
          >
            <Pencil size={17} />
            Editar producto
          </button>
        </div>
      </div>
    </div>
  );
}
