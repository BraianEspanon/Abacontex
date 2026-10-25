import clienteApi from './clienteApi';

import type {
  ContadorNotificacionesResponse,
  ListadoNotificacionesResponse,
  MarcarTodasLeidasResponse,
  NotificacionItem,
  NotificacionesQueryParams,
} from '../types/notificacion.types';

export async function obtenerContadorNotificaciones(): Promise<ContadorNotificacionesResponse> {
  const response = await clienteApi.get<ContadorNotificacionesResponse>('/notificaciones/contador');

  return response.data;
}

export async function obtenerNotificaciones(
  params: NotificacionesQueryParams = {}
): Promise<ListadoNotificacionesResponse> {
  const response = await clienteApi.get<ListadoNotificacionesResponse>('/notificaciones', {
    params,
  });

  return response.data;
}

export async function marcarNotificacionLeida(idNotificacion: number): Promise<NotificacionItem> {
  const response = await clienteApi.patch<NotificacionItem>(
    `/notificaciones/${idNotificacion}/leida`
  );

  return response.data;
}

export async function marcarTodasNotificacionesLeidas(): Promise<MarcarTodasLeidasResponse> {
  const response = await clienteApi.patch<MarcarTodasLeidasResponse>('/notificaciones/leer-todas');

  return response.data;
}
