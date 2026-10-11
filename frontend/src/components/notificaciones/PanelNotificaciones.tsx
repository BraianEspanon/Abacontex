import { CheckCheck, LoaderCircle } from 'lucide-react';

import ItemNotificacion from './ItemNotificacion';

import type { NotificacionItem } from '../../types/notificacion.types';

interface PanelNotificacionesProps {
  notificaciones: NotificacionItem[];
  cargando: boolean;
  error: boolean;
  marcandoTodas: boolean;
  idMarcandoLeida: number | null;
  onSeleccionar: (notificacion: NotificacionItem) => void;
  onMarcarTodas: () => void;
}

export default function PanelNotificaciones({
  notificaciones,
  cargando,
  error,
  marcandoTodas,
  idMarcandoLeida,
  onSeleccionar,
  onMarcarTodas,
}: PanelNotificacionesProps) {
  const hayNoLeidas = notificaciones.some((notificacion) => !notificacion.leida);

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Notificaciones</h3>
          <p className="mt-0.5 text-xs text-gray-500">Novedades de tus ejercicios</p>
        </div>

        {hayNoLeidas && (
          <button
            type="button"
            onClick={onMarcarTodas}
            disabled={marcandoTodas}
            className="flex items-center gap-1.5 text-xs font-medium text-[#496647] hover:underline disabled:cursor-wait disabled:opacity-60"
          >
            <CheckCheck size={15} />
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {cargando && (
          <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-gray-500">
            <LoaderCircle size={18} className="animate-spin" />
            Cargando notificaciones...
          </div>
        )}

        {!cargando && error && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No pudimos cargar las notificaciones.
            </p>
            <p className="mt-1 text-xs text-gray-500">Intentá nuevamente más tarde.</p>
          </div>
        )}

        {!cargando && !error && notificaciones.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">No tenés notificaciones.</p>
            <p className="mt-1 text-xs text-gray-500">
              Las novedades de tus ejercicios aparecerán acá.
            </p>
          </div>
        )}

        {!cargando &&
          !error &&
          notificaciones.map((notificacion) => (
            <ItemNotificacion
              key={notificacion.idNotificacion}
              notificacion={notificacion}
              onClick={onSeleccionar}
              deshabilitada={idMarcandoLeida === notificacion.idNotificacion}
            />
          ))}
      </div>
    </div>
  );
}
