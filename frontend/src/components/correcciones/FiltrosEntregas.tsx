import { Search, SlidersHorizontal } from 'lucide-react';

import type { EstadoCorreccionAlumno, OpcionFiltroCorreccion } from '../../types/correccion.types';

export type FiltroEstadoEntrega = EstadoCorreccionAlumno | 'TODAS';

interface FiltrosEntregasProps {
  busqueda: string;
  estado: FiltroEstadoEntrega;
  opcionesEstado: OpcionFiltroCorreccion[];
  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: FiltroEstadoEntrega) => void;
  onLimpiar: () => void;
}

export default function FiltrosEntregas({
  busqueda,
  estado,
  opcionesEstado,
  onBusquedaChange,
  onEstadoChange,
  onLimpiar,
}: FiltrosEntregasProps) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[1fr_240px_auto] md:items-end">
        <div>
          <label htmlFor="buscar-entrega" className="mb-2 block text-sm font-medium">
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-entrega"
              type="search"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar alumno..."
              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm outline-none focus:border-abacontex-primary"
            />

            <Search className="pointer-events-none absolute right-3 top-2.5 size-4 text-gray-500" />
          </div>
        </div>

        <div>
          <label htmlFor="estado-entrega" className="mb-2 block text-sm font-medium">
            Estado
          </label>

          <select
            id="estado-entrega"
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value as FiltroEstadoEntrega)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-abacontex-primary"
          >
            {opcionesEstado.map((opcion) => (
              <option key={opcion.clave} value={opcion.clave}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          className="inline-flex items-center justify-center gap-2 py-2 text-xs text-abacontex-primary-three hover:underline"
        >
          <SlidersHorizontal className="size-4" />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
