import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  PackageOpen,
  Pencil,
  Plus,
  SearchX,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ProductoListado } from '../../types/producto.types';

interface TablaProductosProps {
  productos: ProductoListado[];
  page: number;
  totalPages: number;
  totalItems: number;
  hayFiltrosActivos: boolean;
  onPageChange: (page: number) => void;
  onVerDetalle: (productoId: number) => void;
  onEditar: (productoId: number) => void;
  onEliminar: (productoId: number) => void;
  onLimpiarFiltros: () => void;
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
}

export default function TablaProductos({
  productos,
  page,
  totalPages,
  totalItems,
  hayFiltrosActivos,
  onPageChange,
  onVerDetalle,
  onEditar,
  onEliminar,
  onLimpiarFiltros,
}: TablaProductosProps) {
  const handleCambiarPagina = (nuevaPagina: number) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPages ||
      nuevaPagina === page
    ) {
      return;
    }

    onPageChange(nuevaPagina);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (productos.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          {hayFiltrosActivos ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2f3ef] text-[#6f7b70]">
                <SearchX size={30} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                No se encontraron productos
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                No hay productos que coincidan con la búsqueda o los filtros seleccionados.
              </p>

              <button
                type="button"
                onClick={onLimpiarFiltros}
                className="mt-6 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3ee] text-[#5f7f62]">
                <PackageOpen size={30} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                Todavía no hay productos registrados
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Registrá el primer producto para comenzar a gestionar el catálogo y el inventario de
                tu empresa.
              </p>

              <Link
                to="/alumno/productos/registrar"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#769a75] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#638563]"
              >
                <Plus size={18} />
                Registrar producto
              </Link>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead className="bg-[#f7f6f1]">
            <tr className="border-b border-[#ebe9df] text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Producto
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Precio unitario
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Stock disponible
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Estado
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => {
              const tieneStock = producto.stock > 0;

              return (
                <tr
                  key={producto.id}
                  className="border-b border-gray-100 transition last:border-b-0 hover:bg-[#fcfcf9]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[#f6f6f2]">
                        {producto.fotoUrl ? (
                          <img
                            src={producto.fotoUrl}
                            alt={producto.nombre}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <ImageOff
                            size={21}
                            className="text-gray-400"
                            strokeWidth={1.6}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {producto.nombre}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Código #{producto.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatearPrecio(producto.precioUnitario)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {producto.stock} unidades
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        tieneStock
                          ? 'bg-[#eaf4e9] text-[#4f6f52]'
                          : 'bg-[#fce9e8] text-[#b84545]'
                      }`}
                    >
                      {tieneStock ? 'Con stock' : 'Sin stock'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onVerDetalle(producto.id)}
                        title="Ver detalle"
                        aria-label={`Ver detalle de ${producto.nombre}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#9caf9c] hover:bg-[#f4f8f4] hover:text-[#4f6f52]"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditar(producto.id)}
                        title="Editar producto"
                        aria-label={`Editar ${producto.nombre}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#9caf9c] hover:bg-[#f4f8f4] hover:text-[#4f6f52]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEliminar(producto.id)}
                        title="Eliminar producto"
                        aria-label={`Eliminar ${producto.nombre}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 bg-[#fffefb] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          Mostrando {productos.length} productos de {totalItems}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => handleCambiarPagina(page - 1)}
            aria-label="Ir a la página anterior"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <p className="min-w-20 text-center text-xs font-medium text-gray-600">
            Página {page} de {Math.max(totalPages, 1)}
          </p>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => handleCambiarPagina(page + 1)}
            aria-label="Ir a la página siguiente"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}