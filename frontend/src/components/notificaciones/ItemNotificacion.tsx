import { BookOpen } from 'lucide-react';

import type { NotificacionItem as Notificacion } from '../../types/notificacion.types';

interface ItemNotificacionProps {
  notificacion: Notificacion;
  onClick: (notificacion: Notificacion) => void;
  deshabilitada?: boolean;
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha);

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function ItemNotificacion({
  notificacion,
  onClick,
  deshabilitada = false,
}: ItemNotificacionProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(notificacion)}
      disabled={deshabilitada}
      className={[
        'flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left',
        'transition-colors hover:bg-gray-50',
        !notificacion.leida ? 'bg-[#f3f7f2]' : 'bg-white',
        deshabilitada ? 'cursor-wait' : '',
      ].join(' ')}
    >
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8efe7] text-[#496647]">
        <BookOpen size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p
            className={[
              'min-w-0 flex-1 text-sm text-gray-900',
              !notificacion.leida ? 'font-semibold' : 'font-medium',
            ].join(' ')}
          >
            {notificacion.titulo}
          </p>

          {!notificacion.leida && (
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#496647]"
              aria-label="No leída"
            />
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">{notificacion.mensaje}</p>

        <p className="mt-1.5 text-xs text-gray-400">{formatearFecha(notificacion.createdAt)}</p>
      </div>
    </button>
  );
}
