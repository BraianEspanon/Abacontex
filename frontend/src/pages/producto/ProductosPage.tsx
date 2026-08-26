import axios from 'axios';
import { Building2, ChevronRight, CircleHelp, Home, Plus } from 'lucide-react';
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

interface ErrorResponse {
  status?: string;
  code?: string;
  message?: string;
  error?: string;
}

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
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (isError) {
    const mensajeBackend = axios.isAxiosError<ErrorResponse>(error)
      ? (error.response?.data?.message ?? error.response?.data?.error ?? '')
      : '';

    const esAlumnoSinEmpresa =
      axios.isAxiosError<ErrorResponse>(error) &&
      error.response?.status === 409 &&
      mensajeBackend === 'No perteneces a ninguna empresa.';

    if (esAlumnoSinEmpresa) {
      return (
        <div className="space-y-5">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="font-medium text-gray-700">Productos</span>
          </nav>

          <header>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>

            <p className="mt-2 text-base text-gray-500">
              Gestioná el catálogo de productos de tu empresa y consultá el stock disponible.
            </p>
          </header>

          <div className="flex justify-center pt-6">
            <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
                <Building2 size={36} className="text-abacontex-primary" />
              </div>

              <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
                Todavía no podés gestionar productos
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
                Para registrar y administrar productos primero necesitás formar parte de una empresa
                de tu curso.
              </p>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
                Cuando seas incorporado a una empresa, vas a poder acceder desde acá a su catálogo,
                consultar el stock y gestionar sus productos.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-abacontex-gray-text">
                <Building2 className="h-4 w-4 text-abacontex-primary" />

                <span>
                  Tu acceso se habilitará automáticamente cuando pertenezcas a una empresa.
                </span>
              </div>
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <section className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
              <CircleHelp size={24} className="text-red-500" />
            </div>

            <div>
              <h1 className="font-heading text-xl font-semibold text-abacontex-black-text">
                No pudimos cargar los productos
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-abacontex-gray-text">
                Ocurrió un problema al consultar la información necesaria para acceder al módulo de
                productos. Intentá nuevamente en unos minutos.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hayFiltrosActivos = search.trim() !== '' || estadoStock !== 'TODOS';

  return (
    <>
      <div className="space-y-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Productos</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>

            <p className="mt-2 text-base text-gray-500">
              Gestioná el catálogo de productos de tu empresa y consultá el stock disponible.
            </p>
          </div>

          <Link
            to="/alumno/productos/registrar"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#769a75] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#638563] sm:self-auto"
          >
            <Plus size={17} />
            Registrar producto
          </Link>
        </header>

        {isFetching && (
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
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
      </div>

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
    </>
  );
}
