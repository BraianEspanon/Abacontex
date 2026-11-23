import { Search, SlidersHorizontal } from 'lucide-react';

import type { EstadoEntregaSimulacion } from '../../types/simulacion.types';

interface FiltrosEntregasSimulacionProps {
  busqueda: string;
  estado: EstadoEntregaSimulacion;
  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (estado: EstadoEntregaSimulacion) => void;
  onLimpiar: () => void;
}

export default function FiltrosEntregasSimulacion({
  busqueda,
  estado,
  onBusquedaChange,
  onEstadoChange,
  onLimpiar,
}: FiltrosEntregasSimulacionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1.8fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="buscar-empresa-simulacion" className="mb-2 block text-sm font-semibold">
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-empresa-simulacion"
              type="text"
              value={busqueda}
              onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Buscar empresa..."
              maxLength={30}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
            />

            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-abacontex-gray-text" />
          </div>
        </div>

        <div>
          <label htmlFor="estado-entrega-simulacion" className="mb-2 block text-sm font-semibold">
            Estado
          </label>

          <select
            id="estado-entrega-simulacion"
            value={estado}
            onChange={(event) => onEstadoChange(event.target.value as EstadoEntregaSimulacion)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
          >
            <option value="TODOS">Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_CURSO">En curso</option>
            <option value="FINALIZADA">Finalizadas</option>
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
