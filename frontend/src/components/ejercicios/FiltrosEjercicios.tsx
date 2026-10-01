import { Search, SlidersHorizontal } from 'lucide-react';

export type EstadoEjercicioFiltro =
  | 'TODOS'
  | 'BORRADOR'
  | 'PUBLICADO'
  | 'SIN_RESOLVER'
  | 'RESUELTO'
  | 'ENVIADO'
  | 'EN_CORRECCION'
  | 'COMPLETADO';

interface CursoFiltro {
  id: number;
  nombre: string;
}

interface FiltrosEjerciciosProps {
  titulo: string;
  cursoId: number | null;
  estado: EstadoEjercicioFiltro;
  cursos: CursoFiltro[];
  onTituloChange: (value: string) => void;
  onCursoChange: (cursoId: number | null) => void;
  onEstadoChange: (estado: EstadoEjercicioFiltro) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosEjercicios({
  titulo,
  cursoId,
  estado,
  cursos,
  onTituloChange,
  onCursoChange,
  onEstadoChange,
  onLimpiarFiltros,
}: FiltrosEjerciciosProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 font-sans shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="buscar-ejercicio"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-ejercicio"
              type="text"
              value={titulo}
              onChange={(event) => onTituloChange(event.target.value)}
              placeholder="Buscar por título..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
            />

            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-abacontex-gray-text" />
          </div>
        </div>

        <div>
          <label
            htmlFor="curso-ejercicio"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Curso
          </label>

          <select
            id="curso-ejercicio"
            value={cursoId ?? ''}
            onChange={(event) => {
              const value = event.target.value;

              onCursoChange(value ? Number(value) : null);
            }}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="">Todos</option>

            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="estado-ejercicio"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Estado
          </label>

          <select
            id="estado-ejercicio"
            value={estado}
            onChange={(event) => onEstadoChange(event.target.value as EstadoEjercicioFiltro)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="TODOS">Todos</option>
            <option value="BORRADOR">Borrador</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="SIN_RESOLVER">Sin resolver</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="ENVIADO">Enviado</option>
            <option value="EN_CORRECCION">En corrección</option>
            <option value="COMPLETADO">Completado</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpiarFiltros}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-abacontex-primary-three transition hover:bg-abacontex-light focus:outline-none"
        >
          <SlidersHorizontal className="size-4" />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
