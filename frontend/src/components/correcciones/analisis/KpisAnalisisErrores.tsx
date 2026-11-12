import { AlertTriangle, BookOpenText, ClipboardList, UsersRound } from 'lucide-react';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type Kpis = AnalisisErroresCursoResponse['kpis'];

interface Props {
  kpis: Kpis;
}

export default function KpisAnalisisErrores({ kpis }: Props) {
  const indicadores = [
    {
      titulo: 'Entregas analizadas',
      valor: kpis.entregasAnalizadas,
      icono: ClipboardList,
      fondo: 'bg-green-100',
      color: 'text-green-700',
    },
    {
      titulo: 'Error más frecuente',
      valor: kpis.errorMasFrecuente,
      icono: AlertTriangle,
      fondo: 'bg-red-100',
      color: 'text-red-600',
    },
    {
      titulo: 'Alumnos afectados',
      valor: kpis.alumnosAfectados,
      icono: UsersRound,
      fondo: 'bg-purple-100',
      color: 'text-purple-700',
    },
    {
      titulo: 'Plantilla con más errores',
      valor: kpis.plantillaConMasErrores,
      icono: BookOpenText,
      fondo: 'bg-orange-100',
      color: 'text-orange-600',
    },
  ];

  return (
    <section
      aria-label="Indicadores del análisis"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {indicadores.map(({ titulo, valor, icono: Icono, fondo, color }) => (
        <article
          key={titulo}
          className="
            flex min-h-[112px] items-center gap-4
            rounded-2xl border border-gray-100
            bg-white px-5 py-5
            shadow-sm transition-shadow duration-200
            hover:shadow-md
          "
        >
          <div
            className={`
              flex h-14 w-14 shrink-0
              items-center justify-center rounded-full
              ${fondo}
            `}
          >
            <Icono size={27} strokeWidth={1.8} className={color} />
          </div>

          <div className="min-w-0 flex-1 text-center">
            <p
              className="
                break-words text-lg font-bold
                leading-tight text-abacontex-black-text
                xl:text-xl
              "
            >
              {valor}
            </p>

            <p className="mt-2 text-xs font-medium text-abacontex-gray-text">{titulo}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
