import { CircleDollarSign, PackageCheck, PackageOpen, Timer } from 'lucide-react';

import type { ResumenProduccion } from '../../types/produccion.types';

interface ResumenOrdenesProduccionProps {
  resumen: ResumenProduccion;
}

const tarjetas = [
  {
    clave: 'total',
    titulo: 'Órdenes totales',
    icono: PackageOpen,
    iconoClases: 'bg-gray-100 text-[#496647]',
    valorClases: 'text-[#496647]',
  },
  {
    clave: 'pendientes',
    titulo: 'Pendientes',
    icono: PackageCheck,
    iconoClases: 'bg-gray-100 text-[#496647]',
    valorClases: 'text-[#496647]',
  },
  {
    clave: 'enProceso',
    titulo: 'En proceso',
    icono: Timer,
    iconoClases: 'bg-gray-100 text-[#496647]',
    valorClases: 'text-[#496647]',
  },
  {
    clave: 'finalizadas',
    titulo: 'Finalizadas',
    icono: CircleDollarSign,
    iconoClases: 'bg-gray-100 text-[#496647]',
    valorClases: 'text-[#496647]',
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
              <Icono className="h-5 w-5" />
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
