import { ArrowRight, CalendarDays, Eye, Files, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';

import type { SimulacionAlumnoCard } from '../../types/simulacion.types';

interface CardSimulacionAlumnoProps {
  simulacion: SimulacionAlumnoCard;
}

export default function CardSimulacionAlumno({ simulacion }: CardSimulacionAlumnoProps) {
  const navigate = useNavigate();

  const finalizada = simulacion.estado === 'FINALIZADA';

  const pendiente = simulacion.estado === 'PENDIENTE';

  const requiereDecision = simulacion.estado === 'EN_CURSO' && simulacion.requiereMiDecision;

  const estadoVisual = obtenerEstadoVisual(simulacion);

  function irASimulacion() {
    if (finalizada) {
      navigate(`/alumno/simulacion/${simulacion.idSimulacionEmpresa}/resumen`);

      return;
    }

    navigate(`/alumno/simulacion/${simulacion.idSimulacionEmpresa}`);
  }

  return (
    <article className="flex min-h-59 flex-col rounded-2xl bg-white p-4 shadow-md">
      <span className={`w-fit rounded-lg px-3 py-1 text-sm font-medium ${estadoVisual.clase}`}>
        {estadoVisual.label}
      </span>

      <h3 className="mt-3 truncate text-xl font-semibold text-abacontex-black-text">
        {simulacion.titulo}
      </h3>

      {/* Información de progreso */}
      <div className="mt-4 rounded-xl bg-abacontex-light p-3">
        {finalizada ? (
          <div className="flex items-center gap-3">
            <Trophy className="size-6 shrink-0 text-abacontex-primary" />

            <div>
              <p className="text-sm font-medium">Simulación completada</p>

              <p className="mt-0.5 text-xs text-abacontex-gray-text">
                Finalizaste todos los eventos
              </p>
            </div>
          </div>
        ) : pendiente ? (
          <div className="flex items-center gap-3">
            <Files className="size-6 shrink-0 text-abacontex-primary" />

            <div>
              <p className="text-sm font-medium">Evento inicial</p>

              <p className="mt-0.5 text-xs text-abacontex-gray-text">
                {simulacion.eventoActualNumero} de {simulacion.cantEventosTotales} eventos
              </p>
            </div>
          </div>
        ) : requiereDecision ? (
          <div className="flex items-center gap-3">
            <Files className="size-6 shrink-0 text-abacontex-primary" />

            <div>
              <p className="text-sm font-medium">Evento actual</p>

              <p className="mt-0.5 text-xs text-abacontex-gray-text">
                {simulacion.eventoActualNumero} de {simulacion.cantEventosTotales} eventos
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Progreso de la simulación</p>

              <span className="text-sm font-semibold">
                {Math.round(simulacion.porcentajeProgreso)}%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-abacontex-primary-three transition-all"
                style={{
                  width: `${Math.min(simulacion.porcentajeProgreso, 100)}%`,
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Fecha */}
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <CalendarDays size={16} />

          {finalizada ? 'Última actividad' : 'Fecha límite'}
        </div>

        <span className="text-right text-xs text-abacontex-gray-text">
          {finalizada
            ? simulacion.ultimaActividad
              ? formatearFechaCorta(simulacion.ultimaActividad)
              : '-'
            : formatearFechaLimite(simulacion.fechaLimite)}
        </span>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <Button
          type="button"
          variant={requiereDecision ? 'solid' : 'outline'}
          label={obtenerTextoBoton(simulacion)}
          icon={finalizada ? <Eye size={16} /> : <ArrowRight size={16} />}
          onClick={irASimulacion}
          className="h-9! w-full rounded-lg! py-0! text-sm!"
        />
      </div>
    </article>
  );
}

function obtenerEstadoVisual(simulacion: SimulacionAlumnoCard) {
  if (simulacion.estado === 'EN_CURSO' && simulacion.requiereMiDecision) {
    return {
      label: 'Requiere tu decisión',
      clase: 'bg-yellow-100 text-yellow-700',
    };
  }

  switch (simulacion.estado) {
    case 'PENDIENTE':
      return {
        label: 'Pendiente',
        clase: 'bg-orange-100 text-orange-500',
      };

    case 'EN_CURSO':
      return {
        label: 'En curso',
        clase: 'bg-fuchsia-100 text-fuchsia-700',
      };

    case 'FINALIZADA':
      return {
        label: 'Finalizada',
        clase: 'bg-abacontex-primary-three text-white',
      };
  }
}

function obtenerTextoBoton(simulacion: SimulacionAlumnoCard) {
  if (simulacion.estado === 'FINALIZADA') {
    return 'Ver resumen';
  }

  if (simulacion.estado === 'EN_CURSO' && simulacion.requiereMiDecision) {
    return 'Responder decisión';
  }

  if (simulacion.estado === 'EN_CURSO') {
    return 'Continuar simulación';
  }

  return 'Comenzar';
}

function formatearFechaLimite(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

function formatearFechaCorta(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
}
