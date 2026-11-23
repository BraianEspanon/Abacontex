import { ClipboardList, Hourglass, Send, Star } from 'lucide-react';

import type { ResumenSimulacionesDocente as ResumenSimulacionesDocenteType } from '../../types/simulacion.types';

interface ResumenSimulacionesDocenteProps {
  resumen: ResumenSimulacionesDocenteType;
}

export default function ResumenSimulacionesDocente({ resumen }: ResumenSimulacionesDocenteProps) {
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
      icono: Send,
      iconClass: 'bg-fuchsia-100 text-fuchsia-700',
      valorClass: 'text-fuchsia-700',
    },
    {
      label: 'Finalizadas',
      valor: resumen.finalizadas,
      icono: Star,
      iconClass: 'bg-green-100 text-abacontex-primary-three',
      valorClass: 'text-abacontex-primary-two',
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icono = item.icono;

        return (
          <article
            key={item.label}
            className="flex h-28 items-center rounded-2xl bg-white px-5 shadow-md"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
            >
              <Icono className="size-6" />
            </div>

            <div className="flex flex-1 flex-col items-center">
              <p className="text-base font-medium text-abacontex-black-text">{item.label}</p>

              <p className={`mt-2 text-2xl font-semibold ${item.valorClass}`}>{item.valor}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
