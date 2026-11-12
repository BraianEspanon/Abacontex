import { ChartNoAxesColumnIncreasing } from 'lucide-react';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type ErrorFrecuente = AnalisisErroresCursoResponse['erroresFrecuentes'][number];

interface Props {
  errores: ErrorFrecuente[];
}

const COLORES = [
  'bg-green-700',
  'bg-green-600',
  'bg-green-500',
  'bg-green-400',
  'bg-green-300',
  'bg-orange-300',
];

export default function ErroresFrecuentes({ errores }: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <ChartNoAxesColumnIncreasing
          size={24}
          strokeWidth={1.8}
          className="text-abacontex-primary"
        />

        <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
          Errores frecuentes
        </h2>
      </div>

      {errores.length === 0 ? (
        <p className="py-5 text-center text-sm text-abacontex-gray-text">
          Todavía no hay errores registrados en las correcciones finalizadas.
        </p>
      ) : (
        <div className="space-y-5">
          {errores.map((error, index) => {
            const porcentaje = Math.min(100, Math.max(0, error.porcentaje));

            const color = COLORES[Math.min(index, COLORES.length - 1)];

            return (
              <div
                key={error.tipoError}
                className="
                  grid grid-cols-1 items-center gap-2
                  sm:grid-cols-[minmax(0,1fr)_minmax(120px,1.5fr)_45px]
                  sm:gap-3
                "
              >
                <p
                  className="min-w-0 text-xs font-medium leading-relaxed text-slate-600"
                  title={error.label}
                >
                  {error.label}
                </p>

                <div
                  role="progressbar"
                  aria-label={error.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={porcentaje}
                  title={`${error.cantidadEntregasAfectadas} entregas afectadas`}
                  className="h-3 overflow-hidden rounded-full bg-gray-100"
                >
                  <div
                    className={`
                      h-full rounded-full
                      transition-all duration-500 ease-out
                      ${color}
                    `}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                <span className="text-right text-xs font-semibold text-abacontex-black-text">
                  {error.porcentaje}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
