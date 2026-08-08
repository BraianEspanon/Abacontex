import { Search, SlidersHorizontal } from 'lucide-react';

interface CursoFiltro {
  id: number;
  nombre: string;
}

export type EstadoEmpresaFiltro = 'TODOS' | 'ACTIVAS' | 'INACTIVAS';

interface FiltrosEmpresasProps {
  cursoId: number | null;
  estado: EstadoEmpresaFiltro;
  search: string;
  cursos: CursoFiltro[];
  onCursoChange: (cursoId: number | null) => void;
  onEstadoChange: (estado: EstadoEmpresaFiltro) => void;
  onSearchChange: (value: string) => void;
  onLimpiarFiltros: () => void;
}

export default function FiltrosEmpresas({
  cursoId,
  estado,
  search,
  cursos,
  onCursoChange,
  onEstadoChange,
  onSearchChange,
  onLimpiarFiltros,
}: FiltrosEmpresasProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.6fr_auto] lg:items-end">
        <div>
          <label htmlFor="curso-empresa" className="mb-2 block text-sm font-semibold text-gray-800">
            Curso
          </label>

          <select
            id="curso-empresa"
            value={cursoId ?? ''}
            onChange={(event) => {
              const value = event.target.value;

              onCursoChange(value ? Number(value) : null);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
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
            htmlFor="estado-empresa"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Estado
          </label>

          <select
            id="estado-empresa"
            value={estado}
            onChange={(event) => onEstadoChange(event.target.value as EstadoEmpresaFiltro)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVAS">Activas</option>
            <option value="INACTIVAS">Inactivas</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="buscar-empresa"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-empresa"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar empresa o integrante..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15"
            />

            <Search
              size={17}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onLimpiarFiltros}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[#6f966f] transition hover:bg-[#f1f6f1] focus:outline-none focus:ring-2 focus:ring-[#769a75]/20"
        >
          <SlidersHorizontal size={16} />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
