import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
  obtenerContadorNotificaciones,
  obtenerNotificaciones,
} from '../api/notificacion.api';

import type { NotificacionesQueryParams } from '../types/notificacion.types';

export const NOTIFICACIONES_QUERY_KEY = ['notificaciones'] as const;
export const CONTADOR_NOTIFICACIONES_QUERY_KEY = ['notificaciones', 'contador'] as const;

export function useContadorNotificaciones() {
  return useQuery({
    queryKey: CONTADOR_NOTIFICACIONES_QUERY_KEY,
    queryFn: obtenerContadorNotificaciones,
  });
}

export function useNotificaciones(params: NotificacionesQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: [...NOTIFICACIONES_QUERY_KEY, 'listado', params],
    queryFn: () => obtenerNotificaciones(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useMarcarNotificacionLeida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marcarNotificacionLeida,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: NOTIFICACIONES_QUERY_KEY,
        }),
      ]);
    },
  });
}

export function useMarcarTodasNotificacionesLeidas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marcarTodasNotificacionesLeidas,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: NOTIFICACIONES_QUERY_KEY,
      });
    },
  });
}
