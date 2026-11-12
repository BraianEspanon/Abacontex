import { BookOpenText, ClipboardList, FileSpreadsheet, ReceiptText } from 'lucide-react';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type Distribucion = AnalisisErroresCursoResponse['distribucionPlantillas'][number];

interface Props {
  distribucion: Distribucion[];
}

const ESTILOS = {
  LIBRO_DIARIO: {
    icono: BookOpenText,
    fondo: 'bg-green-100',
    color: 'text-green-700',
  },
  LIBRO_MAYOR: {
    icono: ClipboardList,
    fondo: 'bg-blue-100',
    color: 'text-blue-600',
  },
  HOJA_TRABAJO: {
    icono: FileSpreadsheet,
    fondo: 'bg-purple-100',
    color: 'text-purple-600',
  },
  IVA: {
    icono: ReceiptText,
    fondo: 'bg-orange-100',
    color: 'text-orange-600',
  },
};

export default function DistribucionErroresPlantilla({ distribucion }: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 font-heading text-lg font-semibold text-abacontex-black-text">
        Distribución de errores por plantilla
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {distribucion.map((plantilla) => {
          const estilo = ESTILOS[plantilla.categoria];
          const Icono = estilo.icono;

          const porcentaje = Math.min(100, Math.max(0, plantilla.porcentaje));

          return (
            <article
              key={plantilla.categoria}
              className="
                flex min-h-[110px] items-center gap-3
                rounded-xl border border-gray-200
                bg-white p-4
                transition-shadow duration-200
                hover:shadow-sm
              "
            >
              <div
                className={`
                  flex h-12 w-12 shrink-0
                  items-center justify-center rounded-full
                  ${estilo.fondo}
                `}
              >
                <Icono size={24} strokeWidth={1.8} className={estilo.color} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-abacontex-black-text">
                  {plantilla.label}
                </h3>

                <p className="mt-2 text-sm font-bold text-abacontex-primary">
                  {plantilla.porcentaje}%
                  <span className="ml-1 text-[11px] font-normal text-abacontex-gray-text">
                    de los errores
                  </span>
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <div
                    role="progressbar"
                    aria-label={`Distribución de ${plantilla.label}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={porcentaje}
                    className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100"
                  >
                    <div
                      className="h-full rounded-full bg-green-700 transition-all duration-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>

                  <span className="shrink-0 text-[11px] text-slate-500">
                    {plantilla.cantidadErrores}{' '}
                    {plantilla.cantidadErrores === 1 ? 'error' : 'errores'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
