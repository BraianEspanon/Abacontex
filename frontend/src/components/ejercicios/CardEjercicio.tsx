import { CalendarDays, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { EjercicioItem, EstadoEjercicio } from '../../types/ejercicio.types';

interface CardEjercicioProps {
  ejercicio: EjercicioItem;
  totalAlumnos: number;
}

export default function CardEjercicio({ ejercicio, totalAlumnos }: CardEjercicioProps) {
  const estado = obtenerEstadoVisual(ejercicio.estado);

  const porcentaje =
    totalAlumnos > 0 ? Math.min((ejercicio.totalEntregas / totalAlumnos) * 100, 100) : 0;

  const debeContinuarResolucion = estado.id === 'SIN_RESOLVER';

  return (
    <article className="rounded-2xl bg-white p-4 font-sans shadow-md">
      <h3 className="truncate text-xl font-semibold text-abacontex-black-text">
        {ejercicio.titulo}
      </h3>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-lg bg-green-100 px-4 py-1 text-sm font-semibold text-abacontex-primary">
          {ejercicio.curso.nombreCurso}
        </span>

        <span className={`rounded-lg px-2 py-1 text-sm font-medium ${estado.clase}`}>
          {estado.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium text-abacontex-black-text">
          <CalendarDays className="size-4" />
          <span>Fecha límite</span>
        </div>

        <span className="text-abacontex-gray-text">
          {formatearFechaLimite(ejercicio.fechaLimite)}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-abacontex-black-text">Entregas</span>

          <span className="text-abacontex-gray-text">
            {ejercicio.totalEntregas}/{totalAlumnos}
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

      <Link
        to={
          debeContinuarResolucion
            ? `/docente/ejercicios/${ejercicio.idEjercicio}/resolucion`
            : `/docente/ejercicios/${ejercicio.idEjercicio}`
        }
        className="mt-4 flex h-8 w-full items-center justify-center gap-2 rounded-md border border-gray-300 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-abacontex-light"
      >
        {debeContinuarResolucion ? (
          <>
            <Pencil className="size-4" />
            Continuar resolución
          </>
        ) : (
          <>
            <Eye className="size-4" />
            Ver detalle
          </>
        )}
      </Link>
    </article>
  );
}

function obtenerEstadoVisual(estado: EstadoEjercicio) {
  switch (estado) {
    case 'BORRADOR':
      return {
        id: 'BORRADOR',
        label: 'Borrador',
        clase: 'bg-orange-100 text-orange-600',
        barra: 'bg-orange-400',
      };

    case 'SIN_RESOLVER':
      return {
        id: 'SIN_RESOLVER',
        label: 'Sin resolver',
        clase: 'bg-orange-100 text-orange-500',
        barra: 'bg-orange-400',
      };

    case 'EN_CORRECCION':
      return {
        id: 'EN_CORRECCION',
        label: 'En corrección',
        clase: 'bg-fuchsia-100 text-fuchsia-500',
        barra: 'bg-fuchsia-400',
      };

    case 'COMPLETADO':
      return {
        id: 'COMPLETADO',
        label: 'Completado',
        clase: 'bg-abacontex-primary-three text-white',
        barra: 'bg-abacontex-primary-three',
      };

    case 'ENVIADO':
      return {
        id: 'ENVIADO',
        label: 'Enviado',
        clase: 'bg-green-100 text-abacontex-primary',
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
  }).format(valor);
}
