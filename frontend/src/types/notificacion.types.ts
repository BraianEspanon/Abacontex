export interface NotificacionItem {
  idNotificacion: number;
  ejercicioId: number | null;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export type EstadoNotificacion = 'TODAS' | 'NO_LEIDAS' | 'LEIDAS';

export interface NotificacionesQueryParams {
  page?: number;
  pageSize?: number;
  estado?: EstadoNotificacion;
}

export interface ListadoNotificacionesResponse {
  items: NotificacionItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ContadorNotificacionesResponse {
  noLeidas: number;
}

export interface MarcarTodasLeidasResponse {
  actualizadas: number;
}

export interface NotificacionSocketEvento {
  tipo: string;
  titulo: string;
  mensaje: string;
  data?: {
    idEjercicio?: number;
    cursoId?: number;
    docenteNombre?: string;
    fechaLimite?: string;
  };
  createdAt: string;
}
