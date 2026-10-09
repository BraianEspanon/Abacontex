import { Notificacion } from '@prisma/client';
import { NotificacionItemDTO } from './notificacion.dto';

export function toNotificacionItemDTO(notificacion: Notificacion): NotificacionItemDTO {
  return {
    idNotificacion: notificacion.idNotificacion,
    ejercicioId: notificacion.ejercicioId,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    leida: notificacion.leida,
    createdAt: notificacion.createdAt.toISOString(),
  };
}
