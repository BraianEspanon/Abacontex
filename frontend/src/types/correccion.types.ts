export type EstadoCorreccionEjercicio =
  | 'SIN_ENTREGAS'
  | 'PENDIENTE'
  | 'EN_CORRECCION'
  | 'CORREGIDO';

export interface CursoResumenCorreccion {
  idCurso: number;
  nombreCurso: string;
  totalAlumnos: number;
}

export interface EjercicioCorreccion {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: CursoResumenCorreccion;
  estado: EstadoCorreccionEjercicio;
  totalEntregasRecibidas: number;
  cantidadSinEntregar: number;
  entregasCorregidas: number;
  entregasEnCorreccion: number;
  entregasPendientes: number;
  tieneResolucionDocente: boolean;
  createdAt: string;
}

export interface ResumenCorrecciones {
  total: number;
  sinEntregas: number;
  pendientes: number;
  enCorreccion: number;
  corregidos: number;
}

export interface CorreccionesResponse {
  items: EjercicioCorreccion[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenCorrecciones;
}

export interface FiltrosCorreccionesParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  cursoId?: number;
  estado?: EstadoCorreccionEjercicio | 'TODAS';
}
