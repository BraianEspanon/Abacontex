import { PaginatedResponse } from '../paginated-response.dto';

export interface NotificacionItemDTO {
  idNotificacion: number;
  ejercicioId: number | null;
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
