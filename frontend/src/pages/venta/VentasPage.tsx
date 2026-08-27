import { ChevronRight, Home, Plus, RotateCcw, Search, WalletCards } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import DetalleVentaModal from '../../components/venta/DetalleVentaModal';
import ResumenVentas from '../../components/venta/ResumenVentas';
import TablaVentas from '../../components/venta/TablaVentas';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
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

  /*
   * Primero consultamos al alumno.
   *
   * Ventas está habilitado para todos los cursos,
   * pero requiere que el alumno pertenezca a una empresa.
   */
  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  /*
   * Solo consultamos las ventas cuando el alumno
   * pertenece a una empresa.
   */
  const { data, isLoading, isError, refetch } = useVentas(
    {
      search: search.trim() || undefined,
      metodoPagoId,
      mes,
      page,
      pageSize: PAGE_SIZE,
    },
    tieneEmpresa
  );

  /*
   * Los métodos de pago también se consultan
   * solamente cuando existe una empresa.
   */
  const { data: metodosPago = [], isLoading: cargandoMetodosPago } = useMetodosPago(tieneEmpresa);

  const {
    data: detalleVenta,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetalleVenta(idVentaSeleccionada);

  /*
   * Si llegamos desde el modal posterior al registro
   * de una venta, consumimos el id enviado mediante
   * React Router y limpiamos posteriormente el state.
   */
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

  /*
   * Primero resolvemos el estado del alumno.
   */
  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando ventas...</p>
      </div>
    );
  }

  if (errorAlumno || !alumno) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          No fue posible comprobar la información del alumno
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un problema al consultar tus datos actuales.
        </p>

        <button
          type="button"
          onClick={() => refetchAlumno()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /*
   * Ventas está disponible para todos los cursos,
   * pero requiere pertenecer a una empresa.
   */
  if (!tieneEmpresa) {
    return <EstadoVentasSinEmpresa />;
  }

  /*
   * Desde este punto sabemos que existe una empresa.
   */
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
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Ventas</span>
        </nav>

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>

            <p className="mt-1 text-sm text-gray-500">
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

        {/* Resumen */}
        <ResumenVentas resumen={data.resumen} />

        {/* Filtros */}
        <section className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.72fr_0.72fr_auto] lg:items-end">
            {/* Buscar */}
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

            {/* Formas de pago */}
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

            {/* Período */}
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

            {/* Limpiar filtros */}
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

        {/* Listado */}
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

function EstadoVentasSinEmpresa() {
  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Ventas</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>

        <p className="mt-1 text-sm text-gray-500">
          Consultá las ventas registradas por tu empresa y generá nuevas operaciones comerciales.
        </p>
      </header>

      {/* Estado sin empresa */}
      <div className="flex justify-center pt-6">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            <WalletCards size={36} className="text-abacontex-primary" />
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            Todavía no pertenecés a una empresa
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            Para acceder al módulo de Ventas primero tenés que formar parte de una empresa de tu
            curso.
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            Cuando seas incorporado a una empresa, vas a poder registrar y consultar las operaciones
            comerciales realizadas por tu empresa.
          </p>
        </section>
      </div>
    </div>
  );
}
