import { PaginatedResponse } from '../paginated-response.dto';
import {
  EstadoCorreccionAlumno,
  EstadoCorreccionEjercicio,
} from '../../constants/correccion.constants';

export interface CursoResumenCorreccionDTO {
  idCurso: number;
  nombreCurso: string;
  totalAlumnos: number;
}

export interface ItemTableroCorreccionDTO {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: CursoResumenCorreccionDTO;
  estado: EstadoCorreccionEjercicio;
  totalEntregasRecibidas: number;
  cantidadSinEntregar: number;
  entregasCorregidas: number;
  entregasEnCorreccion: number;
  entregasPendientes: number;
  createdAt: string;
}

export interface ResumenTableroCorreccionesDTO {
  total: number;
  sinEntregas: number;
  pendientes: number;
  enCorreccion: number;
  corregidos: number;
}

export interface ListadoEjerciciosACorregirResponseDTO extends PaginatedResponse<ItemTableroCorreccionDTO> {
  resumen: ResumenTableroCorreccionesDTO;
}

export interface CursoFiltroDTO {
  idCurso: number;
  nombreCurso: string;
}

export interface OpcionFiltroEstadoCorreccionDTO {
  clave: string;
  label: string;
}

export interface OpcionesFiltrosCorreccionResponseDTO {
  cursos: CursoFiltroDTO[];
  estados: OpcionFiltroEstadoCorreccionDTO[];
}

export interface CabeceraEjercicioEntregasDTO {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  plantillasHabilitadas: string[];
  totalAlumnos: number;
  totalEntregasRecibidas: number;
  entregasCorregidas: number;
  entregasPendientes: number;
  cantidadSinEntregar: number;
}

export interface ItemAlumnoEntregaDTO {
  idAlumno: string;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfilUrl: string | null;
  idEntrega: number | null;
  fechaEntrega: string | null;
  fueraDeTermino: boolean;
  estado: EstadoCorreccionAlumno;
  totalPlantillas: number;
  plantillasResueltas: number;
  plantillasCorregidas: number;
  tieneRetroalimentacion: boolean;
}

export interface FiltrosEntregasEjercicioDTO {
  estados: OpcionFiltroEstadoCorreccionDTO[];
}

export interface ListadoEntregasEjercicioResponseDTO extends PaginatedResponse<ItemAlumnoEntregaDTO> {
  ejercicio: CabeceraEjercicioEntregasDTO;
  filtros: FiltrosEntregasEjercicioDTO;
}
