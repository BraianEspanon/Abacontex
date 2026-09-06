import { CircleCheckBig, ClipboardList, Clock3, Factory } from 'lucide-react';

import type { ResumenProduccion } from '../../types/produccion.types';

interface ResumenOrdenesProduccionProps {
  resumen: ResumenProduccion;
}

const tarjetas = [
  {
    clave: 'total',
    titulo: 'Órdenes totales',
    icono: ClipboardList,
    iconoClases: 'bg-[#eef4eb] text-[#496647]',
    valorClases: 'text-[#496647]',
  },
  {
    clave: 'pendientes',
    titulo: 'Pendientes',
    icono: Clock3,
    iconoClases: 'bg-amber-50 text-amber-600',
    valorClases: 'text-amber-600',
  },
  {
    clave: 'enProceso',
    titulo: 'En proceso',
    icono: Factory,
    iconoClases: 'bg-blue-50 text-blue-600',
    valorClases: 'text-blue-600',
  },
  {
    clave: 'finalizadas',
    titulo: 'Finalizadas',
    icono: CircleCheckBig,
    iconoClases: 'bg-green-50 text-green-600',
    valorClases: 'text-green-600',
  },
] as const;

export default function ResumenOrdenesProduccion({ resumen }: ResumenOrdenesProduccionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ clave, titulo, icono: Icono, iconoClases, valorClases }) => (
        <article
          key={clave}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div
              className={[
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                iconoClases,
              ].join(' ')}
            >
              <Icono className="h-5 w-5" strokeWidth={2} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">{titulo}</p>

              <p className={['mt-0.5 text-xl font-semibold', valorClases].join(' ')}>
                {resumen[clave]}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
