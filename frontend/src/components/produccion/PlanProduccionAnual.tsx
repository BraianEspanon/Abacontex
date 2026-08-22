import { BarChart3, CalendarDays, CheckCircle2, Pencil, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';

import type { PlanificacionAnual } from '../../types/planificacion.types';

interface PlanProduccionAnualProps {
  planificacion: PlanificacionAnual;
}

export default function PlanProduccionAnual({ planificacion }: PlanProduccionAnualProps) {
  const navigate = useNavigate();

  const tienePlanificacion = planificacion.estado === 'CARGADA';

  const mesActual = new Date().getMonth() + 1;

  const detalleMesActual = tienePlanificacion
    ? planificacion.meses.find((mes) => mes.mes === mesActual)
    : undefined;

  const estimadoAnual = tienePlanificacion ? planificacion.resumen.unidadesEstimadas : null;

  const producidoAcumulado = tienePlanificacion ? planificacion.resumen.unidadesProducidas : null;

  const estimadoMesActual = detalleMesActual ? detalleMesActual.unidadesEstimadas : null;

  /*
   * Para la barra visual limitamos el ancho al 100%.
   *
   * El cumplimiento real puede superar 100% y se sigue
   * mostrando correctamente en el dashboard anual.
   */
  const porcentajeProduccion = tienePlanificacion
    ? Math.max(0, Math.min(100, planificacion.resumen.cumplimiento))
    : 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* COLUMNA IZQUIERDA */}
        <div>
          {/* Encabezado */}
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#496647]" />

            <h2 className="text-lg font-medium text-[#496647]">Plan de producción mensual</h2>
          </div>

          {/* Indicadores */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniIndicador
              titulo="Estimado anual"
              valor={estimadoAnual !== null ? `${estimadoAnual} u.` : '-'}
              icono={<BarChart3 className="h-5 w-5" />}
            />

            <MiniIndicador
              titulo="Producido"
              valor={producidoAcumulado !== null ? `${producidoAcumulado} u.` : '-'}
              icono={<CheckCircle2 className="h-5 w-5" />}
            />

            <MiniIndicador
              titulo="Estimado del mes"
              valor={estimadoMesActual !== null ? `${estimadoMesActual} u.` : '-'}
              icono={<Target className="h-5 w-5" />}
            />
          </div>

          {/* Acceso a planificación */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              label="Ir a estimación anual"
              icon={<Pencil className="h-3.5 w-3.5" />}
              onClick={() => navigate('/alumno/produccion/planificacion')}
              className="!rounded-lg !px-3.5 !py-2 !text-xs"
            />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-700">Estimado vs producido (anual)</h3>

          <div className="mt-4 space-y-5">
            <BarraComparacion
              etiqueta="Estimado anual"
              valor={estimadoAnual !== null ? `${estimadoAnual} u.` : '-'}
              porcentaje={tienePlanificacion ? 100 : 0}
              principal
            />

            <BarraComparacion
              etiqueta="Producido acumulado"
              valor={producidoAcumulado !== null ? `${producidoAcumulado} u.` : '-'}
              porcentaje={porcentajeProduccion}
            />
          </div>

          <EscalaComparacion maximo={estimadoAnual ?? 0} />

          <p className="mt-5 text-xs text-gray-500">
            La planificación se carga al inicio del ciclo y se ajusta mes a mes.
          </p>
        </div>
      </div>
    </section>
  );
}

interface MiniIndicadorProps {
  titulo: string;
  valor: string;
  icono: React.ReactNode;
}

function MiniIndicador({ titulo, valor, icono }: MiniIndicadorProps) {
  return (
    <article className="flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-3 text-center shadow-sm">
      <div className="text-[#496647]">{icono}</div>

      <p className="mt-2 text-xs text-gray-500">{titulo}</p>

      <p className="mt-1 text-lg font-semibold text-[#496647]">{valor}</p>
    </article>
  );
}

interface BarraComparacionProps {
  etiqueta: string;
  valor: string;
  porcentaje: number;
  principal?: boolean;
}

function BarraComparacion({
  etiqueta,
  valor,
  porcentaje,
  principal = false,
}: BarraComparacionProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-gray-600">{etiqueta}</span>

        <span className="text-xs font-semibold text-gray-700">{valor}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-sm bg-gray-100">
        <div
          className={[
            'h-full rounded-sm transition-all duration-300',
            principal ? 'bg-[#a8c49d]' : 'bg-[#496647]',
          ].join(' ')}
          style={{
            width: `${porcentaje}%`,
          }}
        />
      </div>
    </div>
  );
}

interface EscalaComparacionProps {
  maximo: number;
}

function EscalaComparacion({ maximo }: EscalaComparacionProps) {
  if (maximo <= 0) {
    return null;
  }

  /*
   * Escala completamente dinámica.
   *
   * Se divide el máximo planificado en cuatro intervalos,
   * evitando números hardcodeados de la maqueta.
   */
  const marcas = Array.from({ length: 5 }, (_, indice) => Math.round((maximo * indice) / 4));

  return (
    <div className="mt-2">
      <div className="h-px bg-gray-200" />

      <div className="mt-1 flex justify-between">
        {marcas.map((marca, indice) => (
          <span key={`${marca}-${indice}`} className="text-[10px] text-gray-400">
            {marca}
          </span>
        ))}
      </div>
    </div>
  );
}
