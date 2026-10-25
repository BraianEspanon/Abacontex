import { PaginatedResponse } from '../paginated-response.dto';
import { TipoNotificacion } from '../../constants/notificacion.constants';

export interface NotificacionItemDTO {
  idNotificacion: number;
  ejercicioId: number | null;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export type ListadoNotificacionesResponseDTO = PaginatedResponse<NotificacionItemDTO>;

export interface ContadorNotificacionesResponseDTO {
  noLeidas: number;
}

export interface MarcarTodasLeidasResponseDTO {
  actualizadas: number;
}
