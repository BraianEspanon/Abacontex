import { Search, SlidersHorizontal } from 'lucide-react';

import type {
  CursoFiltroSimulacionDocente,
  EstadoFiltroSimulacionDocente,
  OpcionEstadoSimulacionDocente,
} from '../../types/simulacion.types';

interface FiltrosSimulacionesDocenteProps {
  titulo: string;
  cursoId: number | null;
  estado: EstadoFiltroSimulacionDocente;
  cursos: CursoFiltroSimulacionDocente[];
  estados: OpcionEstadoSimulacionDocente[];
  onTituloChange: (titulo: string) => void;
  onCursoChange: (cursoId: number | null) => void;
  onEstadoChange: (estado: EstadoFiltroSimulacionDocente) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosSimulacionesDocente({
  titulo,
  cursoId,
  estado,
  cursos,
  estados,
  onTituloChange,
  onCursoChange,
  onEstadoChange,
  onLimpiarFiltros,
}: FiltrosSimulacionesDocenteProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="buscar-simulacion"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-simulacion"
              type="text"
              value={titulo}
              onChange={(event) => onTituloChange(event.target.value)}
              placeholder="Buscar por título de simulación..."
              maxLength={60}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
            />

            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-abacontex-gray-text" />
          </div>
        </div>

        <div>
          <label
            htmlFor="curso-simulacion"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Curso
          </label>

          <select
            id="curso-simulacion"
            value={cursoId ?? ''}
            onChange={(event) => {
              const value = event.target.value;

              onCursoChange(value ? Number(value) : null);
            }}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="">Todos</option>

            {cursos.map((curso) => (
              <option key={curso.idCurso} value={curso.idCurso}>
                {curso.nombreCurso}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="estado-simulacion"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Estado
          </label>

          <select
            id="estado-simulacion"
            value={estado}
            onChange={(event) =>
              onEstadoChange(event.target.value as EstadoFiltroSimulacionDocente)
            }
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            {estados.map((opcion) => (
              <option key={opcion.clave} value={opcion.clave}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpiarFiltros}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-abacontex-primary-three transition hover:bg-abacontex-light"
        >
          <SlidersHorizontal className="size-4" />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
