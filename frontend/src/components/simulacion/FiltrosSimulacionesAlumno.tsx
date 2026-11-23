import { Search, SlidersHorizontal } from 'lucide-react';

import type {
  EstadoFiltroSimulacionAlumno,
  OpcionEstadoSimulacionAlumno,
} from '../../types/simulacion.types';

interface FiltrosSimulacionesAlumnoProps {
  titulo: string;
  estado: EstadoFiltroSimulacionAlumno;
  estados: OpcionEstadoSimulacionAlumno[];
  onTituloChange: (valor: string) => void;
  onEstadoChange: (estado: EstadoFiltroSimulacionAlumno) => void;
  onLimpiar: () => void;
}

export default function FiltrosSimulacionesAlumno({
  titulo,
  estado,
  estados,
  onTituloChange,
  onEstadoChange,
  onLimpiar,
}: FiltrosSimulacionesAlumnoProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1.8fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="buscar-simulacion-alumno" className="mb-2 block text-sm font-semibold">
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-simulacion-alumno"
              type="text"
              value={titulo}
              onChange={(event) => onTituloChange(event.target.value)}
              placeholder="Buscar por título..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
            />

            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-abacontex-gray-text" />
          </div>
        </div>

        <div>
          <label htmlFor="estado-simulacion-alumno" className="mb-2 block text-sm font-semibold">
            Estado
          </label>

          <select
            id="estado-simulacion-alumno"
            value={estado}
            onChange={(event) => onEstadoChange(event.target.value as EstadoFiltroSimulacionAlumno)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
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
          onClick={onLimpiar}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-abacontex-primary-three transition hover:bg-abacontex-light"
        >
          <SlidersHorizontal size={16} />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
