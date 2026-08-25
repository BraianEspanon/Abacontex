import { ChevronRight, Home, Plus, RotateCcw, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import DetalleVentaModal from '../../components/venta/DetalleVentaModal';
import ResumenVentas from '../../components/venta/ResumenVentas';
import TablaVentas from '../../components/venta/TablaVentas';

import { useDetalleVenta } from '../../hooks/useDetalleVenta';
import { useMetodosPago } from '../../hooks/useMetodosPago';
import { useVentas } from '../../hooks/useVentas';

interface VentasLocationState {
  idVenta?: number;
}

const PAGE_SIZE = 10;

export default function VentasPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as VentasLocationState | null;

  const idVentaInicial = locationState?.idVenta ?? null;

  const [search, setSearch] = useState('');
  const [metodoPagoId, setMetodoPagoId] = useState<number | undefined>(undefined);
  const [mes, setMes] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [idVentaSeleccionada, setIdVentaSeleccionada] = useState<number | null>(idVentaInicial);

  const { data, isLoading, isError, refetch } = useVentas({
    search: search.trim() || undefined,
    metodoPagoId,
    mes,
    page,
    pageSize: PAGE_SIZE,
  });

  const { data: metodosPago = [], isLoading: cargandoMetodosPago } = useMetodosPago();

  const {
    data: detalleVenta,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetalleVenta(idVentaSeleccionada);

  useEffect(() => {
    if (!locationState?.idVenta) {
      return;
    }

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, locationState?.idVenta, navigate]);

  const handleCambiarBusqueda = (valor: string) => {
    setSearch(valor);
    setPage(1);
  };

  const handleCambiarMetodoPago = (valor: string) => {
    setMetodoPagoId(valor === '' ? undefined : Number(valor));
    setPage(1);
  };

  const handleCambiarMes = (valor: string) => {
    setMes(valor === '' ? undefined : Number(valor));
    setPage(1);
  };

  const handleLimpiarFiltros = () => {
    setSearch('');
    setMetodoPagoId(undefined);
    setMes(undefined);
    setPage(1);
  };

  const handleVerDetalle = (idVenta: number) => {
    setIdVentaSeleccionada(idVenta);
  };

  const handleCerrarDetalle = () => {
    setIdVentaSeleccionada(null);
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    if (!data) {
      return;
    }

    if (nuevaPagina < 1 || nuevaPagina > data.totalPages) {
      return;
    }

    setPage(nuevaPagina);
  };

  const hayFiltrosActivos = search.trim() !== '' || metodoPagoId !== undefined || mes !== undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando ventas...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar las ventas</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar la información de ventas.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] space-y-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-semibold text-gray-800">Ventas</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Consultá las ventas registradas por tu empresa y generá nuevas operaciones
              comerciales.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/alumno/ventas/registrar')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6f9468] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5f8059]"
          >
            <Plus className="h-4 w-4" />
            Registrar venta
          </button>
        </header>

        <ResumenVentas resumen={data.resumen} />

        <section className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.72fr_0.72fr_auto] lg:items-end">
            <div>
              <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-gray-700">
                Buscar
              </label>

              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(event) => handleCambiarBusqueda(event.target.value)}
                  placeholder="Buscar por cliente o n° de venta..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="metodoPago"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Formas de pago
              </label>

              <select
                id="metodoPago"
                value={metodoPagoId ?? ''}
                onChange={(event) => handleCambiarMetodoPago(event.target.value)}
                disabled={cargandoMetodosPago}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">Todos</option>

                {metodosPago.map((metodo) => (
                  <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mes" className="mb-1.5 block text-sm font-medium text-gray-700">
                Período
              </label>

              <select
                id="mes"
                value={mes ?? ''}
                onChange={(event) => handleCambiarMes(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
              >
                <option value="">Todos</option>
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleLimpiarFiltros}
              disabled={!hayFiltrosActivos}
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-[#496647] transition hover:bg-[#f1f5ef] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar filtros
            </button>
          </div>
        </section>

        {data.items.length === 0 ? (
          <section className="border border-gray-200 bg-white shadow-sm">
            <div className="flex min-h-[140px] items-center justify-center px-6 py-8 text-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {hayFiltrosActivos
                    ? 'No se encontraron ventas con los filtros seleccionados.'
                    : 'Todavía no hay ventas registradas.'}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {hayFiltrosActivos
                    ? 'Probá modificando o limpiando los filtros.'
                    : 'Cuando confirmes una venta, aparecerá en este listado.'}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <TablaVentas
            ventas={data.items}
            page={data.page}
            pageSize={data.pageSize}
            totalItems={data.totalItems}
            totalPages={data.totalPages}
            onPageChange={handleCambiarPagina}
            onVerDetalle={handleVerDetalle}
          />
        )}
      </div>

      <DetalleVentaModal
        abierto={idVentaSeleccionada !== null}
        venta={detalleVenta}
        cargando={cargandoDetalle}
        error={errorDetalle}
        onCerrar={handleCerrarDetalle}
      />
    </>
  );
}
