import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PanelNotificaciones from './PanelNotificaciones';

import {
  useContadorNotificaciones,
  useMarcarNotificacionLeida,
  useMarcarTodasNotificacionesLeidas,
  useNotificaciones,
} from '../../hooks/useNotificaciones';
import { useNotificacionesSocket } from '../../hooks/useNotificacionesSocket';

import type { NotificacionItem } from '../../types/notificacion.types';

export default function CampanaNotificaciones() {
  useNotificacionesSocket();

  const [abierto, setAbierto] = useState(false);
  const [idMarcandoLeida, setIdMarcandoLeida] = useState<number | null>(null);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: contador } = useContadorNotificaciones();

  const {
    data: listado,
    isLoading: cargandoNotificaciones,
    isError: errorNotificaciones,
  } = useNotificaciones(
    {
      page: 1,
      pageSize: 10,
      estado: 'TODAS',
    },
    abierto
  );

  const marcarLeida = useMarcarNotificacionLeida();
  const marcarTodas = useMarcarTodasNotificacionesLeidas();

  const cantidadNoLeidas = contador?.noLeidas ?? 0;

  useEffect(() => {
    function cerrarAlHacerClickAfuera(event: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    }

    document.addEventListener('mousedown', cerrarAlHacerClickAfuera);

    return () => {
      document.removeEventListener('mousedown', cerrarAlHacerClickAfuera);
    };
  }, []);

  const seleccionarNotificacion = (notificacion: NotificacionItem) => {
    const navegarAlEjercicio = () => {
      setAbierto(false);

      if (notificacion.ejercicioId) {
        navigate('/alumno/ejercicios');
      }
    };

    if (notificacion.leida) {
      navegarAlEjercicio();
      return;
    }

    setIdMarcandoLeida(notificacion.idNotificacion);

    marcarLeida.mutate(notificacion.idNotificacion, {
      onSuccess: navegarAlEjercicio,
      onSettled: () => {
        setIdMarcandoLeida(null);
      },
    });
  };

  const marcarTodasComoLeidas = () => {
    marcarTodas.mutate();
  };

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        aria-label={
          cantidadNoLeidas > 0 ? `Notificaciones: ${cantidadNoLeidas} sin leer` : 'Notificaciones'
        }
        aria-expanded={abierto}
        onClick={() => setAbierto((valorActual) => !valorActual)}
        className="relative rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell size={19} />

        {cantidadNoLeidas > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {cantidadNoLeidas > 99 ? '99+' : cantidadNoLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <PanelNotificaciones
          notificaciones={listado?.items ?? []}
          cargando={cargandoNotificaciones}
          error={errorNotificaciones}
          marcandoTodas={marcarTodas.isPending}
          idMarcandoLeida={idMarcandoLeida}
          onSeleccionar={seleccionarNotificacion}
          onMarcarTodas={marcarTodasComoLeidas}
        />
      )}
    </div>
  );
}
