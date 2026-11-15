import { CheckCircle2, CircleAlert, Lightbulb, Save, Send, Sparkles } from 'lucide-react';

import Button from '../ui/Button';

interface RetroalimentacionCorreccionProps {
  texto: string;
  onCambiarTexto: (texto: string) => void;
  onGuardar: () => void;
  onSugerirIa: () => void;
  onFinalizar: () => void;
  guardando: boolean;
  sugiriendo: boolean;
  finalizando: boolean;
  puedeSugerirIa: boolean;
  motivoDeshabilitadoIa: string | null;
  puedeFinalizar: boolean;
  plantillasPendientes: number;
  finalizada: boolean;
  cambiosSinGuardar: boolean;
}

export default function RetroalimentacionCorreccion({
  texto,
  onCambiarTexto,
  onGuardar,
  onSugerirIa,
  onFinalizar,
  guardando,
  sugiriendo,
  finalizando,
  puedeSugerirIa,
  motivoDeshabilitadoIa,
  puedeFinalizar,
  plantillasPendientes,
  finalizada,
  cambiosSinGuardar,
}: RetroalimentacionCorreccionProps) {
  const operacionEnCurso = guardando || sugiriendo || finalizando;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        {/* Retroalimentación escrita */}
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Lightbulb size={21} className="text-orange-500" />

            <h2 className="text-lg font-semibold text-gray-900">
              Retroalimentación para el alumno
              <span className="ml-2 text-sm font-normal text-gray-500">(opcional)</span>
            </h2>
          </div>

          <textarea
            id="retroalimentacion"
            aria-label="Retroalimentación para el alumno"
            value={texto}
            onChange={(event) => onCambiarTexto(event.target.value)}
            maxLength={500}
            rows={4}
            disabled={finalizada || finalizando}
            placeholder="Escribí una devolución para el alumno..."
            className="w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-abacontex-primary focus:ring-1 focus:ring-abacontex-primary disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              {cambiosSinGuardar && !finalizada ? 'Cambios sin guardar' : 'Máx. 500 caracteres'}
            </span>

            <span className="tabular-nums">{texto.length}/500</span>
          </div>

          {!finalizada && !puedeSugerirIa && motivoDeshabilitadoIa && (
            <p className="text-xs text-gray-500">IA no disponible: {motivoDeshabilitadoIa}</p>
          )}
        </div>

        {/* Estado y acciones */}
        <div className="flex min-w-0 flex-col gap-4 xl:min-w-[280px]">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">Estado de la corrección</p>

            {finalizada ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <CheckCircle2 size={18} />
                Corrección enviada
              </div>
            ) : plantillasPendientes === 0 ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <CheckCircle2 size={18} />
                Todas las plantillas revisadas
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <CircleAlert size={18} />
                {plantillasPendientes}{' '}
                {plantillasPendientes === 1 ? 'plantilla pendiente' : 'plantillas pendientes'}
              </div>
            )}
          </div>

          {!finalizada && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                label={guardando ? 'Guardando...' : 'Guardar borrador'}
                variant="outline"
                icon={<Save size={16} />}
                onClick={onGuardar}
                disabled={operacionEnCurso || !cambiosSinGuardar}
                className="!rounded-lg !px-3 !py-2.5 text-sm"
              />

              <Button
                type="button"
                label={sugiriendo ? 'Generando...' : 'Sugerir con IA'}
                variant="outline"
                icon={<Sparkles size={16} />}
                onClick={onSugerirIa}
                disabled={operacionEnCurso || !puedeSugerirIa}
                title={motivoDeshabilitadoIa ?? undefined}
                className="!rounded-lg !px-3 !py-2.5 text-sm"
              />

              <Button
                type="button"
                label={finalizando ? 'Enviando...' : 'Enviar corrección'}
                variant="solid"
                icon={<Send size={16} />}
                onClick={onFinalizar}
                disabled={operacionEnCurso || !puedeFinalizar || cambiosSinGuardar}
                className="!rounded-lg !px-4 !py-2.5 text-sm"
              />
            </div>
          )}

          {!finalizada && cambiosSinGuardar && puedeFinalizar && (
            <p className="text-xs text-amber-700">
              Guardá los cambios de la retroalimentación antes de enviar la corrección.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
