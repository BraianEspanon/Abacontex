import { ChevronRight, Settings2 } from 'lucide-react';

import type { DecisionActivaSimulacion } from '../../types/simulacion.types';

interface DecisionActivaAlumnoProps {
  decision: DecisionActivaSimulacion;
  idOpcionSeleccionada: number | null;
  onSeleccionar: (idOpcion: number, texto: string) => void;
}

export default function DecisionActivaAlumno({
  decision,
  idOpcionSeleccionada,
  onSeleccionar,
}: DecisionActivaAlumnoProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary">
            <Settings2 size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">¿Cómo querés responder?</h3>

            <p className="mt-1 text-xs text-abacontex-gray-text">{decision.rolRequeridoTexto}</p>
          </div>
        </div>

        {decision.puedeDecidir && (
          <span className="rounded-full bg-abacontex-primary-three/15 px-3 py-1 text-[10px] font-semibold text-abacontex-primary">
            Tu turno
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {decision.opciones.map((opcion) => {
          const seleccionada = idOpcionSeleccionada === opcion.idOpcion;

          return (
            <button
              key={opcion.idOpcion}
              type="button"
              disabled={!decision.puedeDecidir}
              onClick={() => onSeleccionar(opcion.idOpcion, opcion.texto)}
              className={[
                'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition',
                decision.puedeDecidir ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
                seleccionada
                  ? 'border-abacontex-primary bg-abacontex-primary-three/5'
                  : 'border-gray-200 bg-white hover:border-gray-300',
              ].join(' ')}
            >
              <span
                className={[
                  'flex size-4 shrink-0 items-center justify-center rounded-full border',
                  seleccionada ? 'border-abacontex-primary-three' : 'border-gray-400',
                ].join(' ')}
              >
                {seleccionada && (
                  <span className="size-2 rounded-full bg-abacontex-primary-three" />
                )}
              </span>

              <span className="flex-1 text-sm">{opcion.texto}</span>

              <ChevronRight size={17} className="shrink-0 text-abacontex-gray-text" />
            </button>
          );
        })}
      </div>

      {!decision.puedeDecidir && (
        <p className="mt-4 text-center text-xs text-abacontex-gray-text">
          Tu rol no está habilitado para responder esta decisión.
        </p>
      )}
    </section>
  );
}
