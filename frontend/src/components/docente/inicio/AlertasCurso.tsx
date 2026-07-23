import { AlertTriangle, Clock3, UsersRound } from 'lucide-react';

const alertas = [
  {
    id: 1,
    texto: '4 empresas con baja participación',
    icono: UsersRound,
    estilo: 'text-red-600 bg-red-50',
  },
  {
    id: 2,
    texto: '3 alumnos sin actividad esta semana',
    icono: Clock3,
    estilo: 'text-red-600 bg-red-50',
  },
  {
    id: 3,
    texto: '2 simulaciones vencen mañana',
    icono: AlertTriangle,
    estilo: 'text-orange-600 bg-orange-50',
  },
];

export default function AlertasCurso() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#20251f]">
          Alertas del curso
        </h3>

        <button
          type="button"
          className="text-xs font-medium text-[#557650] hover:underline"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-2">
        {alertas.map((alerta) => {
          const Icono = alerta.icono;

          return (
            <button
              key={alerta.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-left transition-colors hover:bg-gray-50"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alerta.estilo}`}
              >
                <Icono size={17} />
              </div>

              <span className="flex-1 text-xs text-gray-700">
                {alerta.texto}
              </span>

              <span className="text-gray-400">›</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}