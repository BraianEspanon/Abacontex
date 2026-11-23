import { CalendarDays, CheckCircle2, ClipboardList, Trophy, Users } from 'lucide-react';

import type { CabeceraEntregasSimulacion as CabeceraEntregasSimulacionType } from '../../types/simulacion.types';

interface CabeceraEntregasSimulacionProps {
  simulacion: CabeceraEntregasSimulacionType;
}

export default function CabeceraEntregasSimulacion({
  simulacion,
}: CabeceraEntregasSimulacionProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-md">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-abacontex-black-text">{simulacion.titulo}</h1>

        <span
          className={[
            'rounded-lg px-3 py-1 text-sm font-medium',
            obtenerClaseEstado(simulacion.estado),
          ].join(' ')}
        >
          {obtenerLabelEstado(simulacion.estado)}
        </span>

        <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold">
          {simulacion.curso.nombreCurso}
        </span>
      </div>

      <div className="mt-5 grid gap-4 rounded-xl bg-abacontex-light p-4 md:grid-cols-2 xl:grid-cols-4">
        <ItemResumen
          icono={<CalendarDays size={23} />}
          label="Fecha límite"
          valor={formatearFecha(simulacion.fechaLimite)}
        />

        <ItemResumen
          icono={<Trophy size={23} />}
          label="Fecha de finalización"
          valor={simulacion.fechaFinalizacion ? formatearFecha(simulacion.fechaFinalizacion) : '-'}
        />

        <ItemResumen
          icono={<ClipboardList size={23} />}
          label="Tema de la simulación"
          valor={simulacion.tema}
        />

        {simulacion.estado === 'FINALIZADA' ? (
          <ItemResumen
            icono={<CheckCircle2 size={23} />}
            label="Eventos completados"
            valor={`${simulacion.cantEventosTotales} de ${simulacion.cantEventosTotales} eventos`}
          />
        ) : (
          <ItemResumen
            icono={<Users size={23} />}
            label="Empresas que han empezado"
            valor={`${simulacion.empresasQueHanEmpezado} de ${simulacion.empresasTotales} empresas`}
          />
        )}
      </div>
    </section>
  );
}

interface ItemResumenProps {
  icono: React.ReactNode;
  label: string;
  valor: string;
}

function ItemResumen({ icono, label, valor }: ItemResumenProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-abacontex-primary">{icono}</div>

      <div>
        <p className="text-xs font-medium text-abacontex-black-text">{label}</p>

        <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

function obtenerLabelEstado(estado: CabeceraEntregasSimulacionType['estado']) {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';

    case 'EN_CURSO':
      return 'En curso';

    case 'FINALIZADA':
      return 'Finalizada';
  }
}

function obtenerClaseEstado(estado: CabeceraEntregasSimulacionType['estado']) {
  switch (estado) {
    case 'PENDIENTE':
      return 'bg-orange-100 text-orange-500';

    case 'EN_CURSO':
      return 'bg-fuchsia-100 text-fuchsia-700';

    case 'FINALIZADA':
      return 'bg-abacontex-primary-three text-white';
  }
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}
