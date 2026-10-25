import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { CONTADOR_NOTIFICACIONES_QUERY_KEY, NOTIFICACIONES_QUERY_KEY } from './useNotificaciones';

import { getSocket } from '../services/socket';

export function useNotificacionesSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return;
    }

    const recibirNotificacion = () => {
      void queryClient.invalidateQueries({
        queryKey: CONTADOR_NOTIFICACIONES_QUERY_KEY,
      });

      void queryClient.invalidateQueries({
        queryKey: NOTIFICACIONES_QUERY_KEY,
      });
    };

    socket.on('notificacion:nueva', recibirNotificacion);

    return () => {
      socket.off('notificacion:nueva', recibirNotificacion);
    };
  }, [queryClient]);
}
