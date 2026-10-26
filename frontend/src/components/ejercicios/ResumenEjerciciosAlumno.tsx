import { ClipboardList, Hourglass, PencilLine, Send, TriangleAlert } from 'lucide-react';

import type { ResumenEjerciciosAlumno } from '../../types/entrega.types';

interface ResumenEjerciciosAlumnoProps {
  resumen: ResumenEjerciciosAlumno;
}

export default function ResumenEjerciciosAlumno({ resumen }: ResumenEjerciciosAlumnoProps) {
  const tarjetas = [
    {
      titulo: 'Total de ejercicios',
      valor: resumen.total,
      icono: ClipboardList,
      claseIcono: 'bg-gray-100 text-abacontex-primary',
      claseNumero: 'text-abacontex-primary',
    },
    {
      titulo: 'Pendientes',
      valor: resumen.pendientes,
      icono: Hourglass,
      claseIcono: 'bg-orange-100 text-orange-500',
      claseNumero: 'text-orange-500',
    },
    {
      titulo: 'Entregados',
      valor: resumen.entregados,
      icono: Send,
      claseIcono: 'bg-fuchsia-100 text-fuchsia-700',
      claseNumero: 'text-fuchsia-700',
    },
    {
      titulo: 'Corregidos',
      valor: resumen.corregidos,
      icono: PencilLine,
      claseIcono: 'bg-green-100 text-abacontex-primary',
      claseNumero: 'text-abacontex-primary',
    },
    {
      titulo: 'Vencidos',
      valor: resumen.vencidos,
      icono: TriangleAlert,
      claseIcono: 'bg-red-100 text-red-600',
      claseNumero: 'text-red-600',
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tarjetas.map(({ titulo, valor, icono: Icono, claseIcono, claseNumero }) => (
        <article
          key={titulo}
          className="flex min-h-28 items-center rounded-2xl border border-gray-100 bg-white px-4 shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-full ${claseIcono}`}
          >
            <Icono className="size-6" strokeWidth={1.8} />
          </div>

          <div className="ml-4 min-w-0">
            <p className="text-base font-medium text-abacontex-dark">{titulo}</p>

            <p className={`mt-1 text-2xl font-semibold ${claseNumero}`}>{valor}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
