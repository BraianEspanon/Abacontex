import { CalendarDays, ClipboardList, Files } from 'lucide-react';

import type { CabeceraEjercicioEntregas } from '../../types/correccion.types';

interface CabeceraEntregasProps {
  ejercicio: CabeceraEjercicioEntregas;
}

export default function CabeceraEntregas({ ejercicio }: CabeceraEntregasProps) {
  const total = ejercicio.totalAlumnos;
  const recibidas = ejercicio.totalEntregasRecibidas;

  const porcentaje = total > 0 ? Math.min(100, (recibidas / total) * 100) : 0;

  const fechaLimite = new Date(ejercicio.fechaLimite).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1.4fr_1.2fr] lg:items-center">
        <div>
          <p className="font-semibold text-abacontex-black-text">{ejercicio.titulo}</p>

          <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {ejercicio.curso.nombreCurso}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 text-gray-500" />

          <div>
            <p className="text-xs font-medium">Fecha de entrega</p>
            <p className="mt-1 text-xs text-gray-500">{fechaLimite}</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <ClipboardList className="size-4 text-gray-500" />

            <span className="text-xs font-medium">
              {recibidas}/{total} entregas
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-abacontex-primary transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-500">
            <span>{ejercicio.entregasCorregidas} corregidas</span>
            <span>{ejercicio.entregasPendientes} pendientes</span>
            <span>{ejercicio.cantidadSinEntregar} sin entregar</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Files className="mt-0.5 size-4 text-gray-500" />

          <div>
            <p className="text-xs font-medium">Plantillas habilitadas</p>
            <p className="mt-1 text-xs text-gray-500">
              {ejercicio.plantillasHabilitadas.length > 0
                ? ejercicio.plantillasHabilitadas.join(', ')
                : 'Sin plantillas'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
