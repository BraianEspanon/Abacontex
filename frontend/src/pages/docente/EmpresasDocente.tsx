import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import FiltrosEmpresas, {
  type EstadoEmpresaFiltro,
} from '../../components/docente/empresas/FiltrosEmpresas';

import ResumenEmpresas from '../../components/docente/empresas/ResumenEmpresas';
import DetalleEmpresaDocente from '../../components/docente/empresas/DetalleEmpresaDocente';

import { useEmpresasDocente } from '../../hooks/useEmpresasDocente';
import { useDetalleEmpresaDocente } from '../../hooks/useDetalleEmpresaDocente';
import { useCursosDocente } from '../../hooks/useCursosDocente';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 10;

export default function EmpresasDocente() {
  const [cursoId, setCursoId] = useState<number | null>(null);
  const [estado, setEstado] =
    useState<EstadoEmpresaFiltro>('TODOS');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Empresa seleccionada para mostrar el detalle
  const [empresaSeleccionadaId, setEmpresaSeleccionadaId] =
    useState<number | null>(null);

  const searchDebounced = useDebounce(search, 400);

  /*
   * Cursos asignados al docente.
   */
  const {
    data: cursos,
    isError: errorCursos,
  } = useCursosDocente();

  /*
   * Empresas asociadas a los cursos del docente.
   */
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useEmpresasDocente({
    cursoId: cursoId ?? undefined,
    search: searchDebounced.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  /*
   * Detalle de la empresa seleccionada.
   */
  const {
    data: empresaSeleccionada,
    isLoading: cargandoDetalleEmpresa,
    isError: errorDetalleEmpresa,
  } = useDetalleEmpresaDocente(empresaSeleccionadaId);

  const limpiarFiltros = () => {
    setCursoId(null);
    setEstado('TODOS');
    setSearch('');
    setPage(1);
  };

  const cambiarCurso = (nuevoCursoId: number | null) => {
    setCursoId(nuevoCursoId);
    setPage(1);
  };

  const cambiarEstado = (nuevoEstado: EstadoEmpresaFiltro) => {
    setEstado(nuevoEstado);
    setPage(1);
  };

  const cambiarBusqueda = (valor: string) => {
    setSearch(valor);
    setPage(1);
  };

  /*
   * Por el momento el backend no expone estado como parámetro
   * del endpoint de empresas del docente.
   */
  const empresasMostradas =
    estado === 'TODOS'
      ? data?.items ?? []
      : data?.items.filter((empresa) => {
          if (empresa.activa === null) {
            return false;
          }

          if (estado === 'ACTIVAS') {
            return empresa.activa === true;
          }

          if (estado === 'INACTIVAS') {
            return empresa.activa === false;
          }

          return true;
        }) ?? [];

  return (
    <div className="flex min-w-0 items-start gap-4">
      {/* =====================================================
          CONTENIDO PRINCIPAL
          ===================================================== */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/docente"
            className="flex items-center gap-1 transition hover:text-abacontex-dark"
          >
            <Home size={15} />
            Inicio
          </Link>

          <ChevronRight size={15} />

          <span className="font-semibold text-abacontex-dark">
            Empresas
          </span>
        </nav>

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-semibold text-abacontex-dark">
            Empresas
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Consultá y supervisá las empresas asociadas a tus cursos.
          </p>
        </div>

        {/* Filtros */}
        <FiltrosEmpresas
          cursoId={cursoId}
          estado={estado}
          search={search}
          cursos={cursos ?? []}
          onCursoChange={cambiarCurso}
          onEstadoChange={cambiarEstado}
          onSearchChange={cambiarBusqueda}
          onLimpiarFiltros={limpiarFiltros}
        />

        {/* Resumen */}
        {isLoading && !data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        ) : data ? (
          <ResumenEmpresas
            total={data.resumen.total}
            activas={data.resumen.activas}
            inactivas={data.resumen.inactivas}
          />
        ) : null}

        {/* Error cursos */}
        {errorCursos && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No se pudieron cargar los cursos asignados al docente.
          </div>
        )}

        {/* Error empresas */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-medium">
              No se pudieron cargar las empresas.
            </p>

            <p className="mt-1">
              Ocurrió un problema al obtener la información.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* =====================================================
            LISTADO
            ===================================================== */}
        {!isError && (
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-semibold text-abacontex-dark">
                Empresas registradas
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {data
                  ? `${data.totalItems} empresa${
                      data.totalItems === 1 ? '' : 's'
                    } encontrada${
                      data.totalItems === 1 ? '' : 's'
                    }`
                  : 'Cargando empresas...'}
              </p>
            </header>

            {isLoading && !data ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Cargando empresas...
              </div>
            ) : empresasMostradas.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium text-gray-700">
                  No se encontraron empresas.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Probá modificando los filtros de búsqueda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-3">
                        Empresa
                      </th>

                      <th className="px-5 py-3">
                        Curso
                      </th>

                      <th className="px-5 py-3">
                        Integrantes
                      </th>

                      <th className="px-5 py-3">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {empresasMostradas.map((empresa) => {
                      const seleccionada =
                        empresaSeleccionadaId === empresa.id;

                      return (
                        <tr
                          key={empresa.id}
                          onClick={() =>
                            setEmpresaSeleccionadaId(empresa.id)
                          }
                          className={`cursor-pointer transition ${
                            seleccionada
                              ? 'bg-[#f3f7f2]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Empresa */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {empresa.logoUrl ? (
                                <img
                                  src={empresa.logoUrl}
                                  alt={`Logo de ${empresa.nombre}`}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef3ee] text-sm font-semibold text-[#769a75]">
                                  {empresa.nombre
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {empresa.nombre}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                  {empresa.actividad}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Curso */}
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {empresa.curso}
                          </td>

                          {/* Integrantes */}
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {empresa.cantidadIntegrantes}
                          </td>

                          {/* Estado */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                empresa.activa === true
                                  ? 'bg-[#eaf4e9] text-[#4f6f52]'
                                  : empresa.activa === false
                                    ? 'bg-[#fce9e8] text-[#b84545]'
                                    : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {empresa.activa === true
                                ? 'Activa'
                                : empresa.activa === false
                                  ? 'Inactiva'
                                  : 'Sin información'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Paginación */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Página {data.page} de {data.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() =>
                  setPage((pagina) => pagina - 1)
                }
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={data.page >= data.totalPages}
                onClick={() =>
                  setPage((pagina) => pagina + 1)
                }
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          PANEL DE DETALLE
          ===================================================== */}
      {empresaSeleccionadaId !== null && (
        <aside
          className="
            sticky
            top-0
            flex
            h-[calc(100vh-7rem)]
            w-[360px]
            shrink-0
            flex-col
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          {/* Cargando */}
          {cargandoDetalleEmpresa && (
            <div className="flex-1 p-5">
              <div className="animate-pulse space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-52 rounded bg-gray-100" />
                  </div>

                  <div className="h-8 w-8 rounded-lg bg-gray-200" />
                </div>

                <div className="h-36 rounded-xl bg-gray-100" />

                <div className="h-24 rounded-xl bg-gray-100" />

                <div className="h-48 rounded-xl bg-gray-100" />
              </div>
            </div>
          )}

          {/* Error */}
          {errorDetalleEmpresa &&
            !cargandoDetalleEmpresa && (
              <div className="flex h-full flex-col">
                <header className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Detalle de la empresa
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Información de la empresa seleccionada
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setEmpresaSeleccionadaId(null)
                    }
                    aria-label="Cerrar detalle"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    ×
                  </button>
                </header>

                <div className="p-5">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    No se pudo cargar el detalle de la empresa.
                  </div>
                </div>
              </div>
            )}

          {/* Detalle */}
          {empresaSeleccionada &&
            !cargandoDetalleEmpresa &&
            !errorDetalleEmpresa && (
              <DetalleEmpresaDocente
                empresa={empresaSeleccionada}
                onClose={() =>
                  setEmpresaSeleccionadaId(null)
                }
              />
            )}
        </aside>
      )}
    </div>
  );
}