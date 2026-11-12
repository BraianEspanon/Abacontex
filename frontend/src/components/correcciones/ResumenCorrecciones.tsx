import { CheckCircle2, ClipboardList, Hourglass, Pencil } from 'lucide-react';

import type { ResumenCorrecciones as Resumen } from '../../types/correccion.types';

interface Props {
  resumen?: Resumen;
}

export default function ResumenCorrecciones({ resumen }: Props) {
  const indicadores = [
    {
      titulo: 'Pendientes de corregir',
      valor: resumen?.pendientes ?? 0,
      icono: Hourglass,
      color: 'text-orange-500',
      fondo: 'bg-orange-100',
    },
    {
      titulo: 'En corrección',
      valor: resumen?.enCorreccion ?? 0,
      icono: Pencil,
      color: 'text-purple-600',
      fondo: 'bg-purple-100',
    },
    {
      titulo: 'Sin entregas',
      valor: resumen?.sinEntregas ?? 0,
      icono: ClipboardList,
      color: 'text-red-500',
      fondo: 'bg-red-100',
    },
    {
      titulo: 'Corregidos',
      valor: resumen?.corregidos ?? 0,
      icono: CheckCircle2,
      color: 'text-green-700',
      fondo: 'bg-green-100',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {indicadores.map(({ titulo, valor, icono: Icono, color, fondo }) => (
        <div key={titulo} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md">
          <div className={`rounded-full p-3 ${fondo}`}>
            <Icono className={`size-6 ${color}`} />
          </div>

          <div className="flex-1 text-center">
            <p className="text-sm text-abacontex-black-text">{titulo}</p>
            <p className="mt-1 text-xl font-semibold text-abacontex-primary">{valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
