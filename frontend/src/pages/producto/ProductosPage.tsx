import { ChevronRight, Home, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DetalleProductoModal from '../../components/producto/DetalleProductoModal';
import EliminarProductoModal from '../../components/producto/EliminarProductoModal';
import FiltrosProductos from '../../components/producto/FiltrosProductos';
import ResumenProductos from '../../components/producto/ResumenProductos';
import TablaProductos from '../../components/producto/TablaProductos';

import { useDebounce } from '../../hooks/useDebounce';
import { useEliminarProducto } from '../../hooks/useEliminarProducto';
import { useProductoDetalle } from '../../hooks/useProductoDetalle';
import { useProductos } from '../../hooks/useProductos';

import type {
  EstadoStockProducto,
  OrdenProductos,
  ProductoListado,
} from '../../types/producto.types';

export default function ProductosPage() {
  const [search, setSearch] = useState('');
  const [estadoStock, setEstadoStock] = useState<EstadoStockProducto>('TODOS');
  const [orden, setOrden] = useState<OrdenProductos>('NOMBRE_ASC');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [productoDetalleId, setProductoDetalleId] = useState<number | null>(null);

  const [productoAEliminar, setProductoAEliminar] = useState<ProductoListado | null>(null);

  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const eliminarProductoMutation = useEliminarProducto();

  const { data, isLoading, isError, error, isFetching } = useProductos({
    search: debouncedSearch,
    estadoStock,
    orden,
    page,
    pageSize,
  });

  const {
    data: productoDetalle,
    isLoading: isLoadingDetalle,
    isError: isErrorDetalle,
  } = useProductoDetalle(productoDetalleId);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEstadoStockChange = (value: EstadoStockProducto) => {
    setEstadoStock(value);
    setPage(1);
  };

  const handleOrdenChange = (value: OrdenProductos) => {
    setOrden(value);
    setPage(1);
  };

  const handleLimpiarFiltros = () => {
    setSearch('');
    setEstadoStock('TODOS');
    setOrden('NOMBRE_ASC');
    setPage(1);
  };

  const handleVerDetalle = (productoId: number) => {
    setProductoDetalleId(productoId);
  };

  const handleCerrarDetalle = () => {
    setProductoDetalleId(null);
  };

  const handleEditar = (productoId: number) => {
    navigate(`/alumno/productos/${productoId}/editar`);
  };

  const handleAbrirEliminar = (productoId: number) => {
    const producto = data?.items.find((item) => item.id === productoId);

    if (!producto) {
      return;
    }

    eliminarProductoMutation.reset();
    setProductoAEliminar(producto);
  };

  const handleCerrarEliminar = () => {
    if (eliminarProductoMutation.isPending) {
      return;
    }

    eliminarProductoMutation.reset();
    setProductoAEliminar(null);
  };

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) {
      return;
    }

    try {
      await eliminarProductoMutation.mutateAsync(productoAEliminar.id);

      setProductoAEliminar(null);
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-5 w-36 rounded bg-gray-200" />

            <div className="mt-7 h-5 w-2/3 rounded bg-gray-200" />

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 rounded-2xl bg-white shadow-sm" />
              ))}
            </div>

            <div className="mt-6 h-24 rounded-2xl bg-white shadow-sm" />

            <div className="mt-6 h-72 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-abacontex-black-text">Productos e inventario</h1>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-700">No fue posible obtener los productos.</p>

            {error instanceof Error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hayFiltrosActivos = search.trim() !== '' || estadoStock !== 'TODOS';

  return (
    <div className="min-h-full px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Migas de pan" className="mb-7 flex items-center gap-2 text-sm">
          <Link
            to="/alumno"
            aria-label="Ir al inicio del panel del alumno"
            className="inline-flex items-center text-gray-500 transition hover:text-[#4f6f52]"
          >
            <Home size={18} />
          </Link>

          <ChevronRight size={15} className="text-gray-400" />

          <span aria-current="page" className="font-semibold text-gray-900">
            Productos
          </span>
        </nav>

        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base text-gray-500">
              Gestioná el catálogo de productos de tu empresa y consultá el stock disponible.
            </p>
          </div>

          <Link
            to="/alumno/productos/registrar"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#769a75] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#638563]"
          >
            <Plus size={17} />
            Registrar producto
          </Link>
        </div>

        {isFetching && (
          <div className="mb-4 inline-flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#769a75]" />
            Actualizando productos...
          </div>
        )}

        <ResumenProductos resumen={data.resumen} />

        <FiltrosProductos
          search={search}
          estadoStock={estadoStock}
          orden={orden}
          onSearchChange={handleSearchChange}
          onEstadoStockChange={handleEstadoStockChange}
          onOrdenChange={handleOrdenChange}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        <TablaProductos
          productos={data.items}
          page={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          hayFiltrosActivos={hayFiltrosActivos}
          onPageChange={setPage}
          onVerDetalle={handleVerDetalle}
          onEditar={handleEditar}
          onEliminar={handleAbrirEliminar}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {productoDetalleId !== null && isLoadingDetalle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="rounded-2xl bg-white px-8 py-6 shadow-xl">
              <p className="text-sm text-gray-600">Cargando detalle del producto...</p>
            </div>
          </div>
        )}

        {productoDetalleId !== null && isErrorDetalle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                No fue posible obtener el producto
              </h2>

              <p className="mt-2 text-sm text-gray-500">Ocurrió un error al cargar el detalle.</p>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleCerrarDetalle}
                  className="rounded-lg bg-[#4f6f52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#405c43]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {productoDetalleId !== null && productoDetalle && (
          <DetalleProductoModal
            producto={productoDetalle}
            onClose={handleCerrarDetalle}
            onEditar={(productoId) => {
              handleCerrarDetalle();
              handleEditar(productoId);
            }}
          />
        )}

        {productoAEliminar && (
          <EliminarProductoModal
            producto={productoAEliminar}
            isPending={eliminarProductoMutation.isPending}
            error={eliminarProductoMutation.error}
            onConfirmar={handleConfirmarEliminar}
            onClose={handleCerrarEliminar}
          />
        )}
      </div>
    </div>
  );
}
