export interface NotificacionItemDTO {
  idNotificacion: number;
  ejercicioId: number | null;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export interface ListadoNotificacionesResponseDTO {
  items: NotificacionItemDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

