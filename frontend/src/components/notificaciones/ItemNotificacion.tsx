import { BookOpen, CheckCircle2, Clock3 } from 'lucide-react';

import type {
  NotificacionItem as Notificacion,
  TipoNotificacion,
} from '../../types/notificacion.types';

interface ItemNotificacionProps {
  notificacion: Notificacion;
  onClick: (notificacion: Notificacion) => void;
  deshabilitada?: boolean;
}

interface ConfiguracionTipo {
  icono: React.ReactNode;
  contenedorIcono: string;
  colorIcono: string;
  colorPunto: string;
}

function obtenerConfiguracion(tipo: TipoNotificacion): ConfiguracionTipo {
  switch (tipo) {
    case 'VENCIMIENTO_PROXIMO':
      return {
        icono: <Clock3 size={19} />,
        contenedorIcono: 'bg-orange-50',
        colorIcono: 'text-orange-500',
        colorPunto: 'bg-orange-400',
      };

    case 'EJERCICIO_CORREGIDO':
      return {
        icono: <CheckCircle2 size={19} />,
        contenedorIcono: 'bg-violet-50',
        colorIcono: 'text-violet-500',
        colorPunto: 'bg-violet-400',
      };

    case 'EJERCICIO_NUEVO':
    default:
      return {
        icono: <BookOpen size={19} />,
        contenedorIcono: 'bg-emerald-50',
        colorIcono: 'text-emerald-600',
        colorPunto: 'bg-red-500',
      };
  }
}

function formatearTiempoRelativo(fecha: string): string {
  const fechaNotificacion = new Date(fecha);
  const ahora = new Date();

  const diferenciaMs = ahora.getTime() - fechaNotificacion.getTime();

  if (diferenciaMs < 0) {
    return 'Ahora';
  }

  const minutos = Math.floor(diferenciaMs / (1000 * 60));
  const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

  if (minutos < 1) {
    return 'Ahora';
  }

  if (minutos < 60) {
    return `Hace ${minutos} min`;
  }

  if (horas < 24) {
    return `Hace ${horas} h`;
  }

  if (dias === 1) {
    return 'Hace 1 día';
  }

  if (dias < 7) {
    return `Hace ${dias} días`;
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaNotificacion);
}

export default function ItemNotificacion({
  notificacion,
  onClick,
  deshabilitada = false,
}: ItemNotificacionProps) {
  const configuracion = obtenerConfiguracion(notificacion.tipo);

  return (
    <button
      type="button"
      onClick={() => onClick(notificacion)}
      disabled={deshabilitada}
      className={[
        'flex w-full gap-3.5 border-b border-gray-100 px-4 py-4 text-left',
        'transition-colors hover:bg-gray-50',
        !notificacion.leida ? 'bg-[#f8fbf7]' : 'bg-white',
        deshabilitada ? 'cursor-wait opacity-70' : '',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          configuracion.contenedorIcono,
          configuracion.colorIcono,
        ].join(' ')}
      >
        {configuracion.icono}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <span
              className={[
                'mt-[7px] h-2 w-2 shrink-0 rounded-full',
                configuracion.colorPunto,
                notificacion.leida ? 'opacity-30' : '',
              ].join(' ')}
            />

            <p
              className={[
                'min-w-0 text-sm text-gray-900',
                !notificacion.leida ? 'font-semibold' : 'font-medium',
              ].join(' ')}
            >
              {notificacion.titulo}
            </p>
          </div>

          <span className="shrink-0 pt-0.5 text-[11px] text-gray-400">
            {formatearTiempoRelativo(notificacion.createdAt)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">{notificacion.mensaje}</p>
      </div>
    </button>
  );
}
