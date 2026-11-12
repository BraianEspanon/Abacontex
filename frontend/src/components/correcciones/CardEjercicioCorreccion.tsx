import { CalendarDays, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { EjercicioCorreccion, EstadoCorreccionEjercicio } from '../../types/correccion.types';

interface Props {
  ejercicio: EjercicioCorreccion;
}

const ESTADOS: Record<EstadoCorreccionEjercicio, { etiqueta: string; estilo: string }> = {
  SIN_ENTREGAS: {
    etiqueta: 'Sin entregas',
    estilo: 'bg-red-100 text-red-700',
  },
  PENDIENTE: {
    etiqueta: 'Pendiente',
    estilo: 'bg-orange-100 text-orange-600',
  },
  EN_CORRECCION: {
    etiqueta: 'En corrección',
    estilo: 'bg-purple-100 text-purple-700',
  },
  CORREGIDO: {
    etiqueta: 'Corregido',
    estilo: 'bg-green-100 text-green-700',
  },
};

export default function CardEjercicioCorreccion({ ejercicio }: Props) {
  const {
    idEjercicio,
    titulo,
    fechaLimite,
    curso,
    estado,
    totalEntregasRecibidas,
    cantidadSinEntregar,
    entregasCorregidas,
    entregasEnCorreccion,
    entregasPendientes,
  } = ejercicio;

  const totalAlumnos = curso.totalAlumnos;

  const porcentaje = (cantidad: number) => (totalAlumnos > 0 ? (cantidad / totalAlumnos) * 100 : 0);

  const fecha = new Date(fechaLimite);

  const fechaFormateada = Number.isNaN(fecha.getTime())
    ? 'Sin fecha'
    : new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(fecha);

  const configuracion = ESTADOS[estado];

  return (
    <article className="grid items-center gap-5 rounded-xl bg-white p-5 shadow-md lg:grid-cols-[1.3fr_1fr_auto_1.2fr_auto]">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-abacontex-black-text">{titulo}</h3>

        <span className="mt-2 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
          {curso.nombreCurso}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays size={16} />
          <span>Fecha de entrega</span>
        </div>

        <p className="mt-2 text-xs text-abacontex-gray-text">{fechaFormateada}</p>
      </div>

      <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${configuracion.estilo}`}>
        {configuracion.etiqueta}
      </span>

      <div>
        <p className="mb-1 text-xs font-medium">
          {totalEntregasRecibidas}/{totalAlumnos} entregas
        </p>

        <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="bg-green-700" style={{ width: `${porcentaje(entregasCorregidas)}%` }} />

          <div
            className="bg-purple-500"
            style={{ width: `${porcentaje(entregasEnCorreccion)}%` }}
          />

          <div className="bg-orange-400" style={{ width: `${porcentaje(entregasPendientes)}%` }} />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
          <span>
            <span className="text-green-700">●</span> {entregasCorregidas} corregidas
          </span>

          <span>
            <span className="text-purple-600">●</span> {entregasEnCorreccion} en corrección
          </span>

          <span>
            <span className="text-orange-500">●</span> {entregasPendientes} pendientes
          </span>

          <span>
            <span className="text-red-600">●</span> {cantidadSinEntregar} sin entregar
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to={`/docente/ejercicios/${idEjercicio}`}
          className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50"
        >
          <Eye size={15} />
          Ver detalle
        </Link>

        <Link
          to={`/docente/correcciones/ejercicios/${idEjercicio}/entregas`}
          className="flex items-center justify-center gap-2 rounded-md bg-abacontex-primary-three px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
        >
          <ArrowRight size={15} />
          Ir a entregas
        </Link>
      </div>
    </article>
  );
}
