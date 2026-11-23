import { CheckCircle2, ClipboardList, Flag, Hourglass, Play } from 'lucide-react';

import type { ResumenSimulacionesAlumno as ResumenSimulacionesAlumnoType } from '../../types/simulacion.types';

interface ResumenSimulacionesAlumnoProps {
  resumen: ResumenSimulacionesAlumnoType;
}

export default function ResumenSimulacionesAlumno({ resumen }: ResumenSimulacionesAlumnoProps) {
  const items = [
    {
      label: 'Total de simulaciones',
      valor: resumen.total,
      icono: ClipboardList,
      iconClass: 'bg-gray-100 text-abacontex-primary',
      valorClass: 'text-abacontex-primary-two',
    },
    {
      label: 'Pendientes',
      valor: resumen.pendientes,
      icono: Hourglass,
      iconClass: 'bg-orange-100 text-orange-500',
      valorClass: 'text-orange-500',
    },
    {
      label: 'En curso',
      valor: resumen.enCurso,
      icono: Play,
      iconClass: 'bg-fuchsia-100 text-fuchsia-700',
      valorClass: 'text-fuchsia-700',
    },
    {
      label: 'Finalizadas',
      valor: resumen.finalizadas,
      icono: CheckCircle2,
      iconClass: 'bg-green-100 text-abacontex-primary-three',
      valorClass: 'text-abacontex-primary-two',
    },
    {
      label: 'Decisiones por responder',
      valor: resumen.decisionesPorResponder,
      icono: Flag,
      iconClass: 'bg-yellow-100 text-yellow-600',
      valorClass: 'text-yellow-600',
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => {
        const Icono = item.icono;

        return (
          <article
            key={item.label}
            className="flex min-h-27 items-center rounded-2xl bg-white px-4 shadow-md"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
            >
              <Icono size={24} />
            </div>

            <div className="ml-3 flex min-w-0 flex-1 flex-col items-center text-center">
              <p className="text-sm font-medium leading-5 text-abacontex-black-text">
                {item.label}
              </p>

              <p className={`mt-1 text-2xl font-semibold ${item.valorClass}`}>{item.valor}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
