import { Eye, PackageOpen, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ProductoListado } from '../../types/producto.types';

interface TablaProductosProps {
  productos: ProductoListado[];
  page: number;
  totalPages: number;
  totalItems: number;
  hayFiltrosActivos: boolean;
  onVerDetalle: (productoId: number) => void;
  onEditar: (productoId: number) => void;
  onEliminar: (productoId: number) => void;
  onLimpiarFiltros: () => void;
}

export default function TablaProductos({
  productos,
  page,
  totalPages,
  totalItems,
  hayFiltrosActivos,
  onVerDetalle,
  onEditar,
  onEliminar,
  onLimpiarFiltros,
}: TablaProductosProps) {
  if (productos.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          {hayFiltrosActivos ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3ee] text-[#4f6f52]">
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
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#4f6f52] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#405c43]"
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
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-left">
              <th className="px-6 py-4 text-xs font-semibold text-gray-600">Producto</th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-600">Precio unitario</th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-600">Stock disponible</th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-600">Estado</th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => {
              const tieneStock = producto.stock > 0;

              return (
                <tr key={producto.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {producto.fotoUrl ? (
                          <img
                            src={producto.fotoUrl}
                            alt={producto.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-400">Sin foto</span>
                        )}
                      </div>

                      <span className="font-medium text-gray-900">{producto.nombre}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    $
                    {producto.precioUnitario.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{producto.stock} u.</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        tieneStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Eye size={14} />
                        Ver detalle
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditar(producto.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onEliminar(producto.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <p className="text-xs text-gray-500">
          Mostrando {productos.length} productos de {totalItems}
        </p>

        <p className="text-xs text-gray-500">
          Página {page} de {totalPages}
        </p>
      </div>
    </section>
  );
}
