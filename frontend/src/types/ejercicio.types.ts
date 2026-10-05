export type EstadoEjercicio =
  | 'BORRADOR'
  | 'ENVIADO'
  | 'SIN_RESOLVER'
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
  estado: 'BORRADOR' | 'ENVIADO';
  plantillas: TipoPlantillaEjercicio[];
  generacionIA?: {
    tipoEjercicio: TipoEjercicioIA;
    dificultad: DificultadEjercicioIA;
    contextoAdicional?: string | null;
    contenidos: ContenidoAdicionalIA[];
  } | null;
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

export type TipoEjercicioIA =
  | 'COMPRAS_VENTAS_BASICAS'
  | 'OPERACIONES_COMERCIALES_INTEGRADAS'
  | 'AJUSTES_HOJA_TRABAJO'
  | 'COSTOS_PROCESO_PRODUCTIVO';

export type DificultadEjercicioIA = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export type ContenidoAdicionalIA = 'IVA' | 'INTERESES' | 'DESCUENTOS';

export interface GenerarEjercicioIARequest {
  cursoId: number;
  tipoEjercicio: TipoEjercicioIA;
  dificultad: DificultadEjercicioIA;
  contenidosAdicionales: ContenidoAdicionalIA[];
  contextoAdicional?: string;
}

export interface GenerarEjercicioIAResponse {
  enunciadoTexto: string;
}

export interface PlantillaDetalleEjercicio {
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
}

export interface GeneracionIADetalle {
  tipoEjercicio: TipoEjercicioIA;
  dificultad: DificultadEjercicioIA;
  contextoAdicional?: string | null;
  contenidos: ContenidoAdicionalIA[];
}

export interface DetalleEjercicio {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  estado: EstadoEjercicio;
  fechaLimite: string;
  createdAt: string;
  updatedAt: string;
  progresoEntregas: {
    totalAlumnos: number;
    entregasCorregidas: number;
    entregasPendientes: number;
    sinEntregar: number;
    porcentajeEntrega: number;
  };

  resolucionDocente: {
    idResolucion: number;
    estado: string;
  } | null;
  origen: 'IA' | 'DIGITALIZADO';

  curso: {
    idCurso: number;
    nombreCurso: string;
    año?: number;
  };

  plantillas: PlantillaDetalleEjercicio[];

  generacionIA: GeneracionIADetalle | null;
}

export interface EditarEjercicioRequest {
  titulo?: string;
  cursoId?: number;
  enunciado?: string;
  fechaLimite?: string;
  indicaciones?: string | null;
  estado?: 'BORRADOR' | 'ENVIADO';
  plantillas?: TipoPlantillaEjercicio[];
}
