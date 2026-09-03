import { ChevronRight, Home, ReceiptText } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import FiltrosFacturacion from '../../components/facturacion/FiltrosFacturacion';
import ResumenFacturacion from '../../components/facturacion/ResumenFacturacion';
import TablaFacturas from '../../components/facturacion/TablaFacturas';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useFacturas } from '../../hooks/useFacturas';

import type { TipoFactura } from '../../types/facturacion.types';
import FacturaModal from '../../components/facturacion/FacturaModal';
import { useDetalleFactura } from '../../hooks/useDetalleFactura';

const PAGE_SIZE = 10;

export default function FacturacionPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [tipoFactura, setTipoFactura] = useState<TipoFactura | undefined>(undefined);
  const [mes, setMes] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [idFacturaSeleccionada, setIdFacturaSeleccionada] = useState<number | null>(null);
  const [ordenFecha, setOrdenFecha] = useState<'asc' | 'desc'>('desc');

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const { data, isLoading, isError, refetch } = useFacturas(
    {
      search: search.trim() || undefined,
      tipoFactura,
      mes,
      ordenFecha,
      page,
      pageSize: PAGE_SIZE,
    },
    tieneEmpresa
  );

  const { data: detalleFactura, isLoading: cargandoDetalleFactura } =
    useDetalleFactura(idFacturaSeleccionada);

  const hayFiltrosActivos = search.trim() !== '' || tipoFactura !== undefined || mes !== undefined;

  const handleSearchChange = (valor: string) => {
    setSearch(valor);
    setPage(1);
  };

  const handleTipoFacturaChange = (valor?: TipoFactura) => {
    setTipoFactura(valor);
    setPage(1);
  };

  const handleMesChange = (valor?: number) => {
    setMes(valor);
    setPage(1);
  };

  const handleLimpiarFiltros = () => {
    setSearch('');
    setTipoFactura(undefined);
    setMes(undefined);
    setPage(1);
  };

  const handleOrdenFechaChange = () => {
    setOrdenFecha((ordenActual) => (ordenActual === 'desc' ? 'asc' : 'desc'));

    setPage(1);
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

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando facturación...</p>
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
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!tieneEmpresa) {
    return (
      <div className="space-y-5">
        <nav className="flex items-center gap-2 font-sans text-sm">
          <Link
            to="/alumno"
            className="inline-flex items-center gap-1.5 text-abacontex-gray-text transition hover:text-abacontex-black-text"
          >
            <Home className="size-4 shrink-0" />
            <span className="leading-none">Inicio</span>
          </Link>

          <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

          <span className="font-semibold leading-none text-abacontex-dark">Facturación</span>
        </nav>

        <div className="flex justify-center pt-6">
          <section className="flex min-h-80 w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
            <div className="flex size-20 items-center justify-center rounded-full bg-abacontex-primary/10">
              <ReceiptText size={36} className="text-abacontex-primary" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
              Todavía no pertenecés a una empresa
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Para acceder al módulo de Facturación primero tenés que formar parte de una empresa de
              tu curso.
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando facturación...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar la facturación</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar las facturas emitidas.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 font-sans text-sm">
        <Link
          to="/alumno"
          className="inline-flex items-center gap-1.5 text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          <Home className="size-4 shrink-0" />
          <span className="leading-none">Inicio</span>
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <span className="font-semibold leading-none text-abacontex-dark">Facturación</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="mt-1 text-medium font-medium text-abacontex-gray-text">
            Emite, revisa y gestiona las facturas de tu empresa de forma rápida y segura.
          </p>
        </div>
      </header>

      <ResumenFacturacion
        resumen={data.resumen}
        onVerVentasPendientes={() => navigate('/alumno/facturacion/ventas-pendientes')}
      />

      <FiltrosFacturacion
        search={search}
        tipoFactura={tipoFactura}
        mes={mes}
        hayFiltrosActivos={hayFiltrosActivos}
        onSearchChange={handleSearchChange}
        onTipoFacturaChange={handleTipoFacturaChange}
        onMesChange={handleMesChange}
        onLimpiarFiltros={handleLimpiarFiltros}
      />

      {data.items.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-abacontex-black-text">
            {hayFiltrosActivos
              ? 'No se encontraron facturas con los filtros seleccionados.'
              : 'Todavía no hay facturas emitidas.'}
          </p>

          <p className="mt-1 text-xs text-abacontex-gray-text">
            {hayFiltrosActivos
              ? 'Probá modificando o limpiando los filtros.'
              : 'Cuando se genere una factura, aparecerá en este listado.'}
          </p>
        </section>
      ) : (
        <TablaFacturas
          facturas={data.items}
          page={data.page}
          pageSize={data.pageSize}
          totalItems={data.totalItems}
          totalPages={data.totalPages}
          ordenFecha={ordenFecha}
          onOrdenFechaChange={handleOrdenFechaChange}
          onPageChange={handleCambiarPagina}
          onVerDetalle={(idFactura) => setIdFacturaSeleccionada(idFactura)}
        />
      )}

      <FacturaModal
        abierto={Boolean(detalleFactura)}
        factura={detalleFactura ?? null}
        onCerrar={() => setIdFacturaSeleccionada(null)}
      />

      {idFacturaSeleccionada !== null && cargandoDetalleFactura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-6 py-5 shadow-xl">
            <p className="text-sm font-medium text-abacontex-black-text">Cargando factura...</p>

            <p className="mt-1 text-xs text-abacontex-gray-text">
              Estamos preparando el comprobante.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
