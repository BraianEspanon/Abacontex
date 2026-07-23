interface EmpresaRanking {
  posicion: number;
  empresa: string;
  puntaje: number;
  variacion: number;
}

const empresas: EmpresaRanking[] = [
  {
    posicion: 1,
    empresa: 'Innovar S.A.',
    puntaje: 87.8,
    variacion: 2.4,
  },
  {
    posicion: 2,
    empresa: 'EcoMadera S.R.L.',
    puntaje: 86.4,
    variacion: 2.1,
  },
  {
    posicion: 3,
    empresa: 'NexGen',
    puntaje: 84.9,
    variacion: 1.7,
  },
  {
    posicion: 4,
    empresa: 'Maderas del Sur',
    puntaje: 80.2,
    variacion: -0.3,
  },
  {
    posicion: 5,
    empresa: 'Alpha Design',
    puntaje: 78.6,
    variacion: 0.8,
  },
];

export default function RankingEmpresarial() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#20251f]">
          Ranking empresarial
        </h3>

        <button
          type="button"
          className="text-xs font-medium text-[#557650] hover:underline"
        >
          Ver ranking completo
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className="rounded-md bg-[#557650] px-3 py-1 text-xs font-medium text-white"
        >
          6to II
        </button>

        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500"
        >
          5to II
        </button>

        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500"
        >
          5to III
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100">
        <div className="grid grid-cols-[40px_1fr_70px_70px] bg-gray-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          <span>Pos.</span>
          <span>Empresa</span>
          <span>Puntaje</span>
          <span>Variación</span>
        </div>

        {empresas.map((empresa) => (
          <div
            key={empresa.posicion}
            className="grid grid-cols-[40px_1fr_70px_70px] items-center border-t border-gray-100 px-3 py-2 text-xs"
          >
            <span className="font-semibold text-[#20251f]">
              {empresa.posicion}°
            </span>

            <span className="truncate text-gray-700">
              {empresa.empresa}
            </span>

            <span className="font-medium text-[#20251f]">
              {empresa.puntaje.toFixed(1)}
            </span>

            <span
              className={
                empresa.variacion >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {empresa.variacion >= 0 ? '+' : ''}
              {empresa.variacion.toFixed(1)} pts
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}