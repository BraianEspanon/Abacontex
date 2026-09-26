import {
  OpcionTipoEjercicio,
  OpcionDificultad,
  OpcionContenidoAdicional,
} from '../../constants/ejercicio.constants';

export interface DigitalizarEjercicioResponseDTO {
  enunciadoTexto: string;
}

export interface GenerarEjercicioResponseDTO {
  enunciadoTexto: string;
}

export interface OpcionesGeneracionResponseDTO {
  tiposEjercicio: readonly OpcionTipoEjercicio[];
  dificultades: readonly OpcionDificultad[];
  contenidosAdicionales: readonly OpcionContenidoAdicional[];
}

export interface PlantillaEjercicioDTO {
  idEjercicioPlantilla: number;
  tipo: string;
}

export interface GeneracionIADTO {
  idGeneracion: number;
  tipoEjercicio: string;
  dificultad: string;
  contextoAdicional: string | null;
  contenidos: string[];
}

export interface EjercicioCreadoResponseDTO {
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
  plantillas: PlantillaEjercicioDTO[];
  generacionIA: GeneracionIADTO | null;
  resolucion: {
    idResolucion: number;
    estado: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface EjercicioItemDTO {
  idEjercicio: number;
  titulo: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };
  estado: string;
  estadoVisual: string;
  fechaLimite: string;
  totalEntregas: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenEjerciciosDTO {
  total: number;
  enviados: number;
  sinResolver: number;
  resueltos: number;
}

export interface ListadoEjerciciosResponseDTO {
  items: EjercicioItemDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenEjerciciosDTO;
}
