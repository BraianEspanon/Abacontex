import { Notificacion } from '@prisma/client';
import { NotificacionItemDTO } from './notificacion.dto';
import { TipoNotificacion } from '../../constants/notificacion.constants';

export function toNotificacionItemDTO(notificacion: Notificacion): NotificacionItemDTO {
  return {
    idNotificacion: notificacion.idNotificacion,
    ejercicioId: notificacion.ejercicioId,
    tipo: (notificacion as { tipo: TipoNotificacion }).tipo,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    leida: notificacion.leida,
    createdAt: notificacion.createdAt.toISOString(),
  };
}
