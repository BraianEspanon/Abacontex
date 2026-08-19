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
  },
  {
    clave: 'pendientes',
    titulo: 'Pendientes',
    icono: PackageCheck,
  },
  {
    clave: 'enProceso',
    titulo: 'En proceso',
    icono: Timer,
  },
  {
    clave: 'finalizadas',
    titulo: 'Finalizadas',
    icono: CircleDollarSign,
  },
] as const;

export default function ResumenOrdenesProduccion({ resumen }: ResumenOrdenesProduccionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ clave, titulo, icono: Icono }) => (
        <article key={clave} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{titulo}</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">{resumen[clave]}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Icono className="h-5 w-5 text-[#496647]" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
