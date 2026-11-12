import { Search, SlidersHorizontal } from 'lucide-react';

import type { EstadoCorreccionEjercicio } from '../../types/correccion.types';

interface CursoOpcion {
  idCurso: number;
  nombreCurso: string;
}

interface Props {
  busqueda: string;
  cursoId?: number;
  estado: EstadoCorreccionEjercicio | 'TODAS';
  cursos: CursoOpcion[];
  onBusquedaChange: (valor: string) => void;
  onCursoChange: (valor?: number) => void;
  onEstadoChange: (valor: EstadoCorreccionEjercicio | 'TODAS') => void;
  onLimpiar: () => void;
}

export default function FiltrosCorrecciones({
  busqueda,
  cursoId,
  estado,
  cursos,
  onBusquedaChange,
  onCursoChange,
  onEstadoChange,
  onLimpiar,
}: Props) {
  return (
    <div className="grid items-end gap-5 rounded-xl bg-white p-5 shadow-md md:grid-cols-[1.5fr_1fr_1fr_auto]">
      <div>
        <label htmlFor="buscar-correccion" className="mb-2 block text-sm font-medium">
          Buscar
        </label>

        <div className="relative">
          <input
            id="buscar-correccion"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="Buscar por título..."
            maxLength={150}
            className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-sm outline-none focus:border-abacontex-primary"
          />

          <Search className="absolute top-2 right-3 size-5 text-gray-500" />
        </div>
      </div>

      <div>
        <label htmlFor="curso-correccion" className="mb-2 block text-sm font-medium">
          Curso
        </label>

        <select
          id="curso-correccion"
          value={cursoId ?? ''}
          onChange={(event) =>
            onCursoChange(event.target.value ? Number(event.target.value) : undefined)
          }
          className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
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
        <label htmlFor="estado-correccion" className="mb-2 block text-sm font-medium">
          Estado
        </label>

        <select
          id="estado-correccion"
          value={estado}
          onChange={(event) =>
            onEstadoChange(event.target.value as EstadoCorreccionEjercicio | 'TODAS')
          }
          className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
        >
          <option value="TODAS">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_CORRECCION">En corrección</option>
          <option value="SIN_ENTREGAS">Sin entregas</option>
          <option value="CORREGIDO">Corregido</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onLimpiar}
        className="flex items-center justify-center gap-2 whitespace-nowrap py-2 text-xs text-abacontex-primary hover:underline"
      >
        <SlidersHorizontal size={15} />
        Limpiar filtros
      </button>
    </div>
  );
}
