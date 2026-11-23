import { CalendarDays, Eye, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/Button';

import type { EntregaSimulacionEmpresa } from '../../types/simulacion.types';

interface CardEntregaSimulacionProps {
  entrega: EntregaSimulacionEmpresa;
  idSimulacion: number;
}

export default function CardEntregaSimulacion({
  entrega,
  idSimulacion,
}: CardEntregaSimulacionProps) {
  const navigate = useNavigate();

  return (
    <article className="grid gap-4 rounded-2xl bg-white p-4 shadow-md lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] lg:items-center">
      {/* Empresa */}
      <div className="flex min-w-0 items-center gap-3">
        {entrega.logoUrl ? (
          <img
            src={entrega.logoUrl}
            alt={entrega.nombreEmpresa}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-sm font-semibold text-abacontex-primary">
            {obtenerIniciales(entrega.nombreEmpresa)}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate font-semibold text-abacontex-black-text">
            {entrega.nombreEmpresa}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-abacontex-gray-text">
            <Users size={14} />
            {entrega.cantidadIntegrantes} integrantes
          </div>
        </div>
      </div>

      {/* Fecha */}
      <div className="lg:border-l lg:border-gray-200 lg:pl-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays size={16} />

          {entrega.estado === 'FINALIZADA' ? 'Fecha de finalización' : 'Última actividad'}
        </div>

        <p className="mt-1 text-xs text-abacontex-gray-text">
          {entrega.estado === 'FINALIZADA' && entrega.fechaFinalizacion
            ? formatearFechaHora(entrega.fechaFinalizacion)
            : entrega.ultimaActividad
              ? formatearFechaHora(entrega.ultimaActividad)
              : 'Sin actividad'}
        </p>
      </div>

      {/* Progreso */}
      <div className="lg:border-l lg:border-gray-200 lg:pl-4">
        <p className="text-sm font-medium">
          {entrega.estado === 'FINALIZADA' ? 'Simulación completada' : 'Progreso'}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-abacontex-primary-three"
              style={{
                width: `${Math.min(entrega.porcentajeProgreso, 100)}%`,
              }}
            />
          </div>

          <span className="text-xs text-abacontex-gray-text">
            {entrega.eventosCompletados}/{entrega.eventosTotales}
          </span>
        </div>
      </div>

      {/* Roles + puntaje */}
      <div className="grid gap-3 lg:border-l lg:border-gray-200 lg:pl-4">
        <div>
          <p className="text-sm font-medium">Roles involucrados</p>

          <p className="mt-1 text-xs text-abacontex-gray-text">
            {entrega.rolesInvolucrados.length > 0 ? entrega.rolesInvolucrados.join(', ') : '-'}
          </p>
        </div>

        {entrega.estado === 'FINALIZADA' && (
          <div>
            <p className="text-sm font-medium">Puntaje final</p>

            <p className="mt-1 text-xs font-semibold text-abacontex-primary-three">
              {entrega.puntajeFinal !== null ? `${Math.round(entrega.puntajeFinal)}/100` : '-'}
            </p>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        label="Ver simulación"
        icon={<Eye size={15} />}
        onClick={() =>
          navigate(`/docente/simulaciones/${idSimulacion}/entregas/${entrega.idSimulacionEmpresa}`)
        }
        className="h-9! rounded-lg! px-4! py-0! text-sm!"
      />
    </article>
  );
}

function obtenerIniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase();
}

function formatearFechaHora(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}
