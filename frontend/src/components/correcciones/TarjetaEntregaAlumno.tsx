import { ArrowRight, CalendarDays, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { AlumnoEntregaCorreccion, EstadoCorreccionAlumno } from '../../types/correccion.types';

interface TarjetaEntregaAlumnoProps {
  entrega: AlumnoEntregaCorreccion;
}

const estilosEstado: Record<EstadoCorreccionAlumno, string> = {
  SIN_ENTREGAR: 'bg-red-50 text-red-700',
  PENDIENTE: 'bg-orange-100 text-orange-700',
  EN_CORRECCION: 'bg-purple-100 text-purple-700',
  CORREGIDA: 'bg-green-100 text-green-700',
};

const etiquetasEstado: Record<EstadoCorreccionAlumno, string> = {
  SIN_ENTREGAR: 'Sin entregar',
  PENDIENTE: 'Pendiente de corrección',
  EN_CORRECCION: 'En corrección',
  CORREGIDA: 'Corregida',
};

export default function TarjetaEntregaAlumno({ entrega }: TarjetaEntregaAlumnoProps) {
  const nombreCompleto = `${entrega.nombre} ${entrega.apellido}`;

  const iniciales = `${entrega.nombre.charAt(0)}${entrega.apellido.charAt(0)}`.toUpperCase();

  const fecha = entrega.fechaEntrega
    ? new Date(entrega.fechaEntrega).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sin entrega';

  const porcentaje =
    entrega.totalPlantillas > 0
      ? Math.min(100, (entrega.plantillasResueltas / entrega.totalPlantillas) * 100)
      : 0;

  const puedeCorregir =
    entrega.idEntrega !== null &&
    entrega.fechaEntrega !== null &&
    (entrega.estado === 'PENDIENTE' || entrega.estado === 'EN_CORRECCION');

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          {entrega.fotoPerfilUrl ? (
            <img
              src={entrega.fotoPerfilUrl}
              alt=""
              className="size-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
              {iniciales}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-abacontex-black-text">
              {nombreCompleto}
            </p>

            <p className="truncate text-xs text-gray-500">{entrega.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-gray-500" />

          <div>
            <p className="text-xs text-gray-500">Fecha de entrega</p>
            <p className="mt-1 text-xs font-medium">{fecha}</p>

            {entrega.fueraDeTermino && <p className="text-xs text-red-600">Fuera de término</p>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <ClipboardList className="size-4 text-gray-500" />
            <p className="text-xs text-gray-500">Plantillas resueltas</p>
          </div>

          <p className="text-sm font-semibold">
            {entrega.plantillasResueltas}/{entrega.totalPlantillas}
          </p>

          <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-abacontex-primary"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              estilosEstado[entrega.estado]
            }`}
          >
            {etiquetasEstado[entrega.estado]}
          </span>
        </div>

        <div className="lg:justify-self-end">
          {puedeCorregir ? (
            <Link
              to={`/docente/correcciones/entregas/${entrega.idEntrega}`}
              className="inline-flex items-center gap-2 rounded-md bg-abacontex-primary-three px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
            >
              {entrega.estado === 'EN_CORRECCION' ? 'Continuar corrección' : 'Corregir ejercicio'}

              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span className="text-xs text-gray-400">
              {entrega.estado === 'CORREGIDA'
                ? 'Corrección finalizada'
                : entrega.fechaEntrega === null
                  ? 'Sin entrega'
                  : 'No disponible'}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
