export type EstadoParticipacionSimulacion = 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA';

export type EstadoFiltroSimulacionDocente = 'TODOS' | EstadoParticipacionSimulacion;

export interface CursoSimulacion {
  idCurso: number;
  nombreCurso: string;
}

export interface SimulacionDocenteCard {
  idSimulacion: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  fechaLimite: string;
  curso: CursoSimulacion;
  empresasQueHanEmpezado: number;
  empresasTotales: number;
  puntajePromedio: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenSimulacionesDocente {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
}

export interface ListadoSimulacionesDocenteResponse {
  items: SimulacionDocenteCard[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenSimulacionesDocente;
}

export interface FiltrosSimulacionesDocente {
  page?: number;
  pageSize?: number;
  cursoId?: number;
  titulo?: string;
  estado?: EstadoFiltroSimulacionDocente;
}

export interface CursoFiltroSimulacionDocente {
  idCurso: number;
  nombreCurso: string;
}

export interface OpcionEstadoSimulacionDocente {
  clave: EstadoFiltroSimulacionDocente;
  label: string;
}

export interface FiltrosDashboardSimulacionDocenteResponse {
  cursos: CursoFiltroSimulacionDocente[];
  estados: OpcionEstadoSimulacionDocente[];
}
