interface AlumnoEnRiesgo {
  id: number;
  nombre: string;
  curso: string;
  empresa: string;
  motivo: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
}

const alumnosEnRiesgo: AlumnoEnRiesgo[] = [
  {
    id: 1,
    nombre: 'Lucía Gómez',
    curso: '6to II',
    empresa: 'EcoMadera S.R.L.',
    motivo: 'Baja participación',
    nivel: 'Alto',
  },
  {
    id: 2,
    nombre: 'Tomás Rojas',
    curso: '6to II',
    empresa: 'Innovar S.A.',
    motivo: 'Desempeño bajo',
    nivel: 'Alto',
  },
  {
    id: 3,
    nombre: 'Martina Díaz',
    curso: '5to II',
    empresa: 'NexGen S.A.',
    motivo: 'Pendientes contables',
    nivel: 'Medio',
  },
  {
    id: 4,
    nombre: 'Kevin Benítez',
    curso: '6to III',
    empresa: 'Alpha Design',
    motivo: 'Baja precisión contable',
    nivel: 'Medio',
  },
  {
    id: 5,
    nombre: 'Camila Torres',
    curso: '5to II',
    empresa: 'Maderas del Sur',
    motivo: 'Inactividad',
    nivel: 'Bajo',
  },
];

const estilosNivel = {
  Alto: 'bg-red-100 text-red-700',
  Medio: 'bg-orange-100 text-orange-700',
  Bajo: 'bg-green-100 text-green-700',
};

export default function AlumnosEnRiesgo() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#20251f]">
            Alumnos en riesgo
          </h3>

          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
            {alumnosEnRiesgo.length}
          </span>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-[#557650] hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="space-y-3">
        {alumnosEnRiesgo.map((alumno) => (
          <div
            key={alumno.id}
            className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8eee5] text-xs font-semibold text-[#557650]">
              {alumno.nombre
                .split(' ')
                .map((parte) => parte[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#20251f]">
                {alumno.nombre}
              </p>

              <p className="truncate text-xs text-gray-500">
                {alumno.curso} · {alumno.empresa}
              </p>

              <p className="truncate text-xs text-gray-400">
                {alumno.motivo}
              </p>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${estilosNivel[alumno.nivel]}`}
            >
              {alumno.nivel}
            </span>

            <button
              type="button"
              className="rounded-md border border-gray-200 px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-50"
            >
              Ver
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}