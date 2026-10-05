import { ClipboardList, Hourglass, Pencil, Send } from 'lucide-react';

import type { ResumenEjercicios as ResumenEjerciciosType } from '../../types/ejercicio.types';

interface ResumenEjerciciosProps {
  resumen: ResumenEjerciciosType;
}

export default function ResumenEjercicios({ resumen }: ResumenEjerciciosProps) {
  const items = [
    {
      label: 'Total de ejercicios',
      valor: resumen.total,
      icono: ClipboardList,
      iconClass: 'bg-gray-100 text-abacontex-primary',
    },
    {
      label: 'Enviados',
      valor: resumen.enviados,
      icono: Send,
      iconClass: 'bg-gray-100 text-abacontex-primary',
    },
    {
      label: 'Sin resolver',
      valor: resumen.sinResolver,
      icono: Hourglass,
      iconClass: 'bg-orange-100 text-orange-500',
    },
    {
      label: 'En corrección',
      valor: resumen.enCorreccion ?? resumen.resueltos,
      icono: Pencil,
      iconClass: 'bg-fuchsia-100 text-fuchsia-700',
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

              <p className="mt-2 text-2xl font-semibold text-abacontex-primary">{item.valor}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
