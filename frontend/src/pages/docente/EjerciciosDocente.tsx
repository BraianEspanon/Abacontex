import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import FiltrosEjercicios, {
  type EstadoEjercicioFiltro,
} from '../../components/ejercicios/FiltrosEjercicios';

import { useCursosDocente } from '../../hooks/useCursosDocente';
import { useDebounce } from '../../hooks/useDebounce';
import { useEjercicios } from '../../hooks/useEjercicios';

import ResumenEjercicios from '../../components/ejercicios/ResumenEjercicios';
import CardEjercicio from '../../components/ejercicios/CardEjercicio';
import PaginacionEjercicios from '../../components/ejercicios/PaginacionEjercicios';

const PAGE_SIZE = 6;

export default function EjerciciosDocente() {
  const [titulo, setTitulo] = useState('');
  const [cursoId, setCursoId] = useState<number | null>(null);
  const [estado, setEstado] = useState<EstadoEjercicioFiltro>('TODOS');
  const [page, setPage] = useState(1);

  const tituloDebounced = useDebounce(titulo, 400);

  const { data: cursos, isError: errorCursos } = useCursosDocente();

  const { data, isLoading, isError, refetch } = useEjercicios({
    page,
    pageSize: PAGE_SIZE,
    cursoId: cursoId ?? undefined,
    titulo: tituloDebounced.trim() || undefined,
    estado: estado === 'TODOS' ? undefined : estado,
  });

  const cambiarTitulo = (valor: string) => {
    setTitulo(valor);
    setPage(1);
  };

  const cambiarCurso = (nuevoCursoId: number | null) => {
    setCursoId(nuevoCursoId);
    setPage(1);
  };

  const cambiarEstado = (nuevoEstado: EstadoEjercicioFiltro) => {
    setEstado(nuevoEstado);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setTitulo('');
    setCursoId(null);
    setEstado('TODOS');
    setPage(1);
  };

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Ejercicios</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-abacontex-black-text">Mis ejercicios</h1>

          <p className="mt-1 text-sm text-abacontex-gray-text">
            Gestioná los ejercicios de tus cursos.
          </p>
        </div>

        <Link
          to="/docente/ejercicios/nuevo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-abacontex-primary-three px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-abacontex-primary"
        >
          <Plus className="size-4" />
          Nuevo ejercicio
        </Link>
      </div>

      <FiltrosEjercicios
        titulo={titulo}
        cursoId={cursoId}
        estado={estado}
        cursos={cursos ?? []}
        onTituloChange={cambiarTitulo}
        onCursoChange={cambiarCurso}
        onEstadoChange={cambiarEstado}
        onLimpiarFiltros={limpiarFiltros}
      />

      {data && <ResumenEjercicios resumen={data.resumen} />}

      {data && data.items.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((ejercicio) => {
            const curso = cursos?.find((curso) => curso.id === ejercicio.curso.idCurso);

            return (
              <CardEjercicio
                key={ejercicio.idEjercicio}
                ejercicio={ejercicio}
                totalAlumnos={curso?.alumnos ?? 0}
              />
            );
          })}
        </section>
      )}

      {data && data.totalItems > 0 && (
        <PaginacionEjercicios
          page={page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {errorCursos && <p className="text-sm text-red-600">No fue posible cargar los cursos.</p>}

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando ejercicios...</p>}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">No fue posible cargar los ejercicios.</p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 cursor-pointer text-sm font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-abacontex-gray-text">
            No hay ejercicios para mostrar.
          </p>
        </div>
      )}
    </div>
  );
}
