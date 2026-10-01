export type EstadoEjercicio = 'BORRADOR' | 'PUBLICADO' | 'FINALIZADO';

export type EstadoVisualEjercicio =
  | 'BORRADOR'
  | 'PUBLICADO'
  | 'SIN_RESOLVER'
  | 'RESUELTO'
  | 'ENVIADO'
  | 'EN_CORRECCION'
  | 'COMPLETADO';

export interface CursoEjercicio {
  idCurso: number;
  nombreCurso: string;
  año: number;
}

export interface EjercicioItem {
  idEjercicio: number;
  titulo: string;
  curso: CursoEjercicio;
  estado: EstadoEjercicio;
  estadoVisual: EstadoVisualEjercicio;
  fechaLimite: string;
  totalEntregas: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenEjercicios {
  total: number;
  enviados: number;
  sinResolver: number;
  resueltos: number;
  enCorreccion?: number;
}

export interface ListadoEjerciciosResponse {
  items: EjercicioItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenEjercicios;
}

export interface FiltrosEjercicios {
  page?: number;
  pageSize?: number;
  cursoId?: number;
  titulo?: string;
  estado?: string;
}

export interface DigitalizarEjercicioResponse {
  enunciadoTexto: string;
}

export type TipoPlantillaEjercicio = 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'LIBRO_IVA' | 'HOJA_TRABAJO';

export interface CrearEjercicioRequest {
  titulo: string;
  cursoId: number;
  enunciado: string;
  fechaLimite: string;
  indicaciones?: string | null;
  estado: 'BORRADOR' | 'PUBLICADO';
  plantillas: TipoPlantillaEjercicio[];
  generacionIA?: null;
}

export interface EjercicioCreadoResponse {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  estado: string;
  indicaciones: string | null;
  fechaLimite: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };
  plantillas: {
    idEjercicioPlantilla: number;
    tipo: string;
  }[];
  generacionIA: null;
  resolucion: {
    idResolucion: number;
    estado: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
