import { CalendarDays, CheckCircle2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';

import type {
  EstadoParticipacionSimulacion,
  SimulacionDocenteCard,
} from '../../types/simulacion.types';

interface CardSimulacionDocenteProps {
  simulacion: SimulacionDocenteCard;
}

export default function CardSimulacionDocente({ simulacion }: CardSimulacionDocenteProps) {
  const navigate = useNavigate();

  const estado = obtenerEstadoVisual(simulacion.estado);

  const porcentaje =
    simulacion.empresasTotales > 0
      ? Math.min((simulacion.empresasQueHanEmpezado / simulacion.empresasTotales) * 100, 100)
      : 0;

  const finalizada = simulacion.estado === 'FINALIZADA';

  return (
    <article className="flex min-h-59 flex-col rounded-2xl bg-white p-4 shadow-md">
      <h3 className="truncate text-xl font-semibold text-abacontex-black-text">
        {simulacion.titulo}
      </h3>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-lg bg-green-100 px-4 py-1 text-sm font-semibold text-abacontex-black-text">
          {simulacion.curso.nombreCurso}
        </span>

        <span className={`rounded-lg px-3 py-1 text-sm font-medium ${estado.clase}`}>
          {estado.label}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium text-abacontex-black-text">
          <CalendarDays className="size-4" />

          <span>Fecha límite</span>
        </div>

        <span className="text-right text-abacontex-gray-text">
          {formatearFechaLimite(simulacion.fechaLimite)}
        </span>
      </div>

      {finalizada ? (
        <div className="mt-5 flex min-h-10 items-center justify-center gap-2 text-abacontex-primary-three">
          <CheckCircle2 className="size-5 shrink-0" />

          <span className="text-sm font-medium">Puntaje final promedio:</span>

          <span className="text-base font-semibold">
            {formatearPuntaje(simulacion.puntajePromedio)}
          </span>
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-abacontex-black-text">Empresas que han empezado</span>

            <span className="text-abacontex-gray-text">
              {simulacion.empresasQueHanEmpezado}/{simulacion.empresasTotales}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${estado.barra}`}
              style={{
                width: `${porcentaje}%`,
              }}
            />
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        label="Ver entregas"
        icon={<Eye size={16} />}
        onClick={() => navigate(`/docente/simulaciones/${simulacion.idSimulacion}/entregas`)}
        className="mt-auto h-9! w-full rounded-lg! py-0! text-sm!"
      />
    </article>
  );
}

function obtenerEstadoVisual(estado: EstadoParticipacionSimulacion) {
  switch (estado) {
    case 'PENDIENTE':
      return {
        label: 'Pendiente',
        clase: 'bg-orange-100 text-orange-500',
        barra: 'bg-orange-400',
      };

    case 'EN_CURSO':
      return {
        label: 'En curso',
        clase: 'bg-fuchsia-100 text-fuchsia-700',
        barra: 'bg-fuchsia-500',
      };

    case 'FINALIZADA':
      return {
        label: 'Finalizada',
        clase: 'bg-abacontex-primary-three text-white',
        barra: 'bg-abacontex-primary-three',
      };
  }
}

function formatearFechaLimite(fecha: string) {
  const valor = new Date(fecha);

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(valor);
}

function formatearPuntaje(puntaje: number | null) {
  if (puntaje === null) {
    return '-';
  }

  return `${Math.round(puntaje)}/100`;
}
