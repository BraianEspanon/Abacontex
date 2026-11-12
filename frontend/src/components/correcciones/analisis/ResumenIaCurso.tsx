import { CheckCircle2, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';

import Button from '../../ui/Button';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type Diagnostico = AnalisisErroresCursoResponse['diagnosticoIa'];

type ControlIa = AnalisisErroresCursoResponse['controlIa'];

interface Props {
  diagnostico: Diagnostico;
  controlIa: ControlIa;
  generando: boolean;
  errorGeneracion: boolean;
  onGenerar: () => void;
}

export default function ResumenIaCurso({
  diagnostico,
  controlIa,
  generando,
  errorGeneracion,
  onGenerar,
}: Props) {
  const puedeGenerar = controlIa.puedeGenerar && !generando;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Encabezado */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles size={23} strokeWidth={1.8} className="text-orange-500" />

          <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
            Resumen general
          </h2>

          {diagnostico && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
              Generado por IA
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="solid"
          label={
            generando ? 'Generando...' : diagnostico ? 'Actualizar diagnóstico' : 'Generar con IA'
          }
          icon={<RefreshCw size={15} className={generando ? 'animate-spin' : ''} />}
          disabled={!puedeGenerar}
          onClick={onGenerar}
          className="!rounded-lg !px-4 !py-2 text-xs"
        />
      </div>

      {/* Contenido del diagnóstico */}
      {diagnostico ? (
        <div className="space-y-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {diagnostico.resumen}
          </p>

          {/* Recomendaciones */}
          {diagnostico.cosasAReforzar.length > 0 && (
            <div className="rounded-xl border border-green-100 bg-green-50/70 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb size={21} className="text-orange-500" />

                <h3 className="font-heading text-sm font-semibold text-abacontex-black-text">
                  Cosas a reforzar
                </h3>
              </div>

              <ul className="space-y-3">
                {diagnostico.cosasAReforzar.map((item: string, index: number) => (
                  <li
                    key={`${index}-${item}`}
                    className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fecha */}
          <p className="text-xs text-abacontex-gray-text">
            Generado el{' '}
            {new Date(diagnostico.fechaGeneracion).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ) : (
        <p className="text-sm text-abacontex-gray-text">
          Todavía no se generó un diagnóstico pedagógico para este curso.
        </p>
      )}

      {/* Estado de generación */}
      {!controlIa.puedeGenerar && controlIa.motivoDeshabilitado && (
        <p className="mt-4 text-xs leading-relaxed text-abacontex-gray-text">
          {controlIa.motivoDeshabilitado}
        </p>
      )}

      {/* Error */}
      {errorGeneracion && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          No se pudo generar el diagnóstico. Intentá nuevamente.
        </p>
      )}
    </section>
  );
}
