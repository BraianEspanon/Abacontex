import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  GraduationCap,
  Pencil,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import type { EjercicioAlumnoItem, EstadoEntregaAlumno } from '../../types/entrega.types';

interface CardEjercicioAlumnoProps {
  ejercicio: EjercicioAlumnoItem;
}

const etiquetasEstado: Record<EstadoEntregaAlumno, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  ENTREGADO: 'Entregado',
  CORREGIDO: 'Corregido',
  VENCIDO: 'Vencido',
};

const clasesEstado: Record<EstadoEntregaAlumno, string> = {
  PENDIENTE: 'bg-orange-100 text-orange-500',
  EN_PROGRESO: 'bg-blue-100 text-blue-600',
  ENTREGADO: 'bg-fuchsia-100 text-fuchsia-700',
  CORREGIDO: 'bg-green-100 text-abacontex-primary',
  VENCIDO: 'bg-red-100 text-red-600',
};

export default function CardEjercicioAlumno({ ejercicio }: CardEjercicioAlumnoProps) {
  const nombreDocente = `${ejercicio.docente.nombre} ${ejercicio.docente.apellido}`.trim();

  const fechaLimite = formatearFechaHora(ejercicio.fechaLimite);

  const fechaEntrega = ejercicio.fechaEntrega ? formatearFechaHora(ejercicio.fechaEntrega) : null;

  const porcentajePlantillas =
    ejercicio.totalPlantillas > 0
      ? Math.round((ejercicio.plantillasCompletadas / ejercicio.totalPlantillas) * 100)
      : 0;

  const fechaProxima =
    ejercicio.estado === 'PENDIENTE' && esFechaLimiteProxima(ejercicio.fechaLimite);

  return (
    <article className="flex min-h-60 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex min-h-7 items-start justify-between gap-3">
        <span
          className={`rounded-lg px-2 py-1 text-sm font-medium leading-none ${clasesEstado[ejercicio.estado]}`}
        >
          {etiquetasEstado[ejercicio.estado]}
        </span>

        {fechaProxima && (
          <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-medium text-orange-500">
            Fecha próxima
          </span>
        )}

        {ejercicio.estado === 'VENCIDO' && (
          <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
            Entrega fuera de término
          </span>
        )}
      </div>

      <h2 className="mt-2 line-clamp-1 text-xl font-semibold text-abacontex-dark">
        {ejercicio.titulo}
      </h2>

      <div className="mt-2 space-y-2">
        <FilaInformacion icono={<GraduationCap className="size-4" />} etiqueta="Profesor/a">
          <span className="truncate">{nombreDocente}</span>
        </FilaInformacion>

        <FilaInformacion icono={<CalendarDays className="size-4" />} etiqueta="Fecha límite">
          {fechaLimite}
        </FilaInformacion>

        {ejercicio.estado === 'ENTREGADO' && (
          <FilaInformacion
            icono={<CheckCircle2 className="size-4 text-abacontex-primary-three" />}
            etiqueta="Entregado"
          >
            {fechaEntrega ?? '-'}
          </FilaInformacion>
        )}

        {ejercicio.estado === 'CORREGIDO' && (
          <FilaInformacion
            icono={<CheckCircle2 className="size-4 text-abacontex-primary-three" />}
            etiqueta="Corregido"
          >
            Corrección disponible
          </FilaInformacion>
        )}

        {ejercicio.estado !== 'ENTREGADO' && ejercicio.estado !== 'CORREGIDO' && (
          <div className="flex min-h-5 items-center gap-2 text-sm">
            <FileText className="size-4 shrink-0 text-abacontex-gray-text" />

            {ejercicio.estado === 'EN_PROGRESO' ? (
              <span className="text-abacontex-gray-text">
                {ejercicio.plantillasCompletadas} de {ejercicio.totalPlantillas} plantillas
                completadas
              </span>
            ) : (
              <span className="text-abacontex-gray-text">
                {ejercicio.totalPlantillas}{' '}
                {ejercicio.totalPlantillas === 1 ? 'plantilla' : 'plantillas'}
              </span>
            )}

            {ejercicio.estado === 'VENCIDO' && (
              <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-red-600">
                <AlertTriangle className="size-3.5" />
                Aún no entregado
              </span>
            )}
          </div>
        )}
      </div>

      {ejercicio.estado === 'EN_PROGRESO' && (
        <div className="mt-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-abacontex-primary-three transition-all duration-300"
              style={{
                width: `${porcentajePlantillas}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-gray-200 pt-3">
        <AccionesEjercicio ejercicio={ejercicio} />
      </div>
    </article>
  );
}

interface FilaInformacionProps {
  icono: React.ReactNode;
  etiqueta: string;
  children: React.ReactNode;
}

function FilaInformacion({ icono, etiqueta, children }: FilaInformacionProps) {
  return (
    <div className="grid grid-cols-[18px_92px_minmax(0,1fr)] items-center gap-2 text-sm">
      <span className="text-abacontex-dark">{icono}</span>

      <span className="font-medium text-abacontex-dark">{etiqueta}</span>

      <span className="min-w-0 text-abacontex-gray-text">{children}</span>
    </div>
  );
}

function AccionesEjercicio({ ejercicio }: CardEjercicioAlumnoProps) {
  if (ejercicio.estado === 'CORREGIDO') {
    return (
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-2">
        <Link
          to={`/alumno/ejercicios/${ejercicio.idEjercicio}`}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-abacontex-dark transition hover:bg-abacontex-light"
        >
          <Eye className="size-4" />
          Ver detalle
        </Link>

        <Link
          to={`/alumno/ejercicios/${ejercicio.idEjercicio}/correccion`}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-abacontex-primary-three px-2 text-sm font-medium text-white shadow-sm transition hover:bg-abacontex-primary"
        >
          Ver corrección
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  if (ejercicio.estado === 'ENTREGADO') {
    return (
      <Link
        to={`/alumno/ejercicios/${ejercicio.idEjercicio}`}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-abacontex-dark transition hover:bg-abacontex-light"
      >
        <Eye className="size-4" />
        Ver entrega
      </Link>
    );
  }

  if (ejercicio.estado === 'EN_PROGRESO') {
    return (
      <Link
        to={`/alumno/ejercicios/${ejercicio.idEjercicio}/resolucion`}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-abacontex-dark transition hover:border-abacontex-primary-three hover:bg-abacontex-light"
      >
        <Pencil className="size-4" />
        Continuar resolución
      </Link>
    );
  }

  return (
    <Link
      to={`/alumno/ejercicios/${ejercicio.idEjercicio}`}
      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-abacontex-primary-three text-sm font-medium text-white shadow-sm transition hover:bg-abacontex-primary"
    >
      Resolver
      <ArrowRight className="size-4" />
    </Link>
  );
}

function formatearFechaHora(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

function esFechaLimiteProxima(fecha: string) {
  const ahora = Date.now();
  const fechaLimite = new Date(fecha).getTime();

  const diferencia = fechaLimite - ahora;

  const veinticuatroHoras = 24 * 60 * 60 * 1000;

  return diferencia > 0 && diferencia <= veinticuatroHoras;
}
