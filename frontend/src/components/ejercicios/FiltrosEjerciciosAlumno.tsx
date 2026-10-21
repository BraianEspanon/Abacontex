import { Search, SlidersHorizontal } from 'lucide-react';

import type {
  DocenteEntrega,
  EstadoEntregaAlumno,
  OpcionEstadoEntrega,
} from '../../types/entrega.types';

interface FiltrosEjerciciosAlumnoProps {
  busqueda: string;
  docenteId: string;
  estado: EstadoEntregaAlumno | 'TODAS';

  docentes: DocenteEntrega[];
  estados: OpcionEstadoEntrega[];

  onBusquedaChange: (value: string) => void;
  onDocenteChange: (value: string) => void;
  onEstadoChange: (value: EstadoEntregaAlumno | 'TODAS') => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosEjerciciosAlumno({
  busqueda,
  docenteId,
  estado,
  docentes,
  estados,
  onBusquedaChange,
  onDocenteChange,
  onEstadoChange,
  onLimpiarFiltros,
}: FiltrosEjerciciosAlumnoProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="buscar-ejercicio-alumno"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-ejercicio-alumno"
              type="text"
              value={busqueda}
              onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Buscar por título..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
            />

            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-abacontex-gray-text" />
          </div>
        </div>

        <div>
          <label
            htmlFor="docente-ejercicio"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Docente
          </label>

          <select
            id="docente-ejercicio"
            value={docenteId}
            onChange={(event) => onDocenteChange(event.target.value)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="">Todos</option>

            {docentes.map((docente) => (
              <option key={docente.idDocente} value={docente.idDocente}>
                {docente.nombre} {docente.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="estado-ejercicio-alumno"
            className="mb-2 block text-sm font-semibold text-abacontex-black-text"
          >
            Estado
          </label>

          <select
            id="estado-ejercicio-alumno"
            value={estado}
            onChange={(event) =>
              onEstadoChange(event.target.value as EstadoEntregaAlumno | 'TODAS')
            }
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="TODAS">Todos</option>

            {estados
              .filter((opcion) => opcion.clave !== 'TODAS')
              .map((opcion) => (
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
