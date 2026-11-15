import { useMemo, useState } from 'react';
import { BarChart3, ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import CardEjercicioCorreccion from '../../components/correcciones/CardEjercicioCorreccion';
import FiltrosCorrecciones from '../../components/correcciones/FiltrosCorrecciones';
import ResumenCorrecciones from '../../components/correcciones/ResumenCorrecciones';
import PaginacionEjercicios from '../../components/ejercicios/PaginacionEjercicios';
import Button from '../../components/ui/Button';

import { useDebounce } from '../../hooks/useDebounce';
import { useEjerciciosACorregir } from '../../hooks/useEjerciciosACorregir';

import type { EstadoCorreccionEjercicio } from '../../types/correccion.types';

const PAGE_SIZE = 6;

export default function CorreccionesDocente() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [cursoId, setCursoId] = useState<number | undefined>();
  const [estado, setEstado] = useState<EstadoCorreccionEjercicio | 'TODAS'>('TODAS');
  const [page, setPage] = useState(1);

  const busquedaDebounced = useDebounce(busqueda, 400);

  const { data, isLoading, isError, isFetching, refetch } = useEjerciciosACorregir({
    page,
    pageSize: PAGE_SIZE,
    busqueda: busquedaDebounced.trim() || undefined,
    cursoId,
    estado,
  });

  const cursos = useMemo(() => {
    const mapa = new Map<number, string>();

    for (const ejercicio of data?.items ?? []) {
      mapa.set(ejercicio.curso.idCurso, ejercicio.curso.nombreCurso);
    }

    return Array.from(mapa, ([idCurso, nombreCurso]) => ({
      idCurso,
      nombreCurso,
    }));
  }, [data?.items]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setCursoId(undefined);
    setEstado('TODAS');
    setPage(1);
  };

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setPage(1);
  };

  const cambiarCurso = (valor: number | undefined) => {
    setCursoId(valor);
    setPage(1);
  };

  const cambiarEstado = (valor: EstadoCorreccionEjercicio | 'TODAS') => {
    setEstado(valor);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm text-abacontex-gray-text">
        <Link to="/docente" aria-label="Ir al inicio">
          <Home size={19} />
        </Link>

        <ChevronRight size={15} />

        <Link to="/docente">Inicio</Link>

        <ChevronRight size={15} />

        <span className="font-semibold text-abacontex-black-text">Correcciones</span>
      </div>

      {/* Resumen */}
      <ResumenCorrecciones resumen={data?.resumen} />

      {/* Filtros */}
      <FiltrosCorrecciones
        busqueda={busqueda}
        cursoId={cursoId}
        estado={estado}
        cursos={cursos}
        onBusquedaChange={cambiarBusqueda}
        onCursoChange={cambiarCurso}
        onEstadoChange={cambiarEstado}
        onLimpiar={limpiarFiltros}
      />

      {/* Ejercicios */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-xl font-semibold text-abacontex-black-text">
            Ejercicios ({data?.totalItems ?? 0})
          </h1>

          <div className="flex items-center gap-3">
            {isFetching && !isLoading && (
              <span className="text-xs text-abacontex-gray-text">Actualizando...</span>
            )}

            <Button
              type="button"
              label="Análisis de errores"
              variant="solid"
              icon={<BarChart3 size={18} />}
              onClick={() => navigate('/docente/correcciones/analisis-errores')}
              className="!rounded-lg !px-4 !py-2 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Cargando ejercicios...
          </div>
        ) : isError ? (
          <div className="rounded-xl bg-white p-8 text-center">
            <p className="mb-4 text-red-600">No se pudieron cargar las correcciones.</p>

            <Button
              type="button"
              label="Reintentar"
              variant="solid"
              onClick={() => void refetch()}
              className="!rounded-lg !px-4 !py-2 text-sm"
            />
          </div>
        ) : data?.items.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            No se encontraron ejercicios con los filtros seleccionados.
          </div>
        ) : (
          <div className="space-y-4">
            {data?.items.map((ejercicio) => (
              <CardEjercicioCorreccion key={ejercicio.idEjercicio} ejercicio={ejercicio} />
            ))}
          </div>
        )}
      </section>

      {/* Paginación */}
      {data && data.totalItems > 0 && (
        <PaginacionEjercicios
          page={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
