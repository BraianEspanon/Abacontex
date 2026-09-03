import { ArrowLeft, ChevronRight, Home, ReceiptText } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import TablaVentasPendientes from '../../components/facturacion/TablaVentasPendientes';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useVentasPendientesFacturacion } from '../../hooks/useVentasPendientesFacturacion';

const PAGE_SIZE = 10;

export default function VentasPendientesFacturacionPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const { data, isLoading, isError, refetch } = useVentasPendientesFacturacion(
    {
      page,
      pageSize: PAGE_SIZE,
    },
    tieneEmpresa
  );

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
        <p className="text-sm text-abacontex-gray-text">Cargando ventas pendientes...</p>
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
      <div className="flex justify-center pt-6">
        <section className="flex min-h-80 w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex size-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            <ReceiptText size={36} className="text-abacontex-primary" />
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            Todavía no pertenecés a una empresa
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            Para consultar ventas pendientes de facturación primero tenés que formar parte de una
            empresa.
          </p>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando ventas pendientes...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar las ventas pendientes</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar las ventas pendientes de facturación.
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
    <div className="space-y-8 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 font-sans text-sm">
        <Link
          to="/alumno"
          className="inline-flex items-center gap-1.5 text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          <Home className="size-4 shrink-0" />
          <span className="leading-none">Inicio</span>
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <Link
          to="/alumno/facturacion"
          className="font-medium text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          Facturación
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <span className="font-semibold leading-none text-abacontex-black-text">
          Ventas pendientes
        </span>
      </nav>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-abacontex-primary-two">
          Ventas pendientes de facturar
        </h1>

        <button
          type="button"
          onClick={() => navigate('/alumno/facturacion')}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-400 bg-white px-4 py-2 text-sm text-abacontex-black-text shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft className="size-4" />
          Volver a facturas
        </button>
      </div>

      {data.items.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-abacontex-black-text">
            No hay ventas pendientes de facturación.
          </p>

          <p className="mt-1 text-xs text-abacontex-gray-text">
            Todas las ventas registradas ya poseen una factura asociada.
          </p>
        </section>
      ) : (
        <TablaVentasPendientes
          ventas={data.items}
          page={data.page}
          pageSize={data.pageSize}
          totalItems={data.totalItems}
          totalPages={data.totalPages}
          onPageChange={handleCambiarPagina}
          onGenerarFactura={(idVenta) => navigate(`/alumno/facturacion/nueva?ventaId=${idVenta}`)}
        />
      )}
    </div>
  );
}
