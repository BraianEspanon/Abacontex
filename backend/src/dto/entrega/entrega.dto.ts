import { PaginatedResponse } from '../paginated-response.dto';
import { EstadoEntregaAlumno } from '../../constants/entrega.constants';

export interface DocenteResumenDTO {
  idDocente: string;
  nombre: string;
  apellido: string;
}

export interface ItemTableroEntregaDTO {
  idEjercicio: number;
  titulo: string;
  docente: DocenteResumenDTO;
  fechaLimite: string;
  estado: EstadoEntregaAlumno;
  totalPlantillas: number;
  plantillasCompletadas: number;
  fechaEntrega: string | null;
  bloqueado: boolean;
  tieneCorreccion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenTableroEntregasDTO {
  total: number;
  pendientes: number;
  enProgreso: number;
  entregados: number;
  corregidos: number;
  vencidos: number;
}

export interface ListadoEntregasAlumnoResponseDTO extends PaginatedResponse<ItemTableroEntregaDTO> {
  resumen: ResumenTableroEntregasDTO;
}

export interface OpcionFiltroEstadoDTO {
  clave: string;
  label: string;
}

export interface OpcionesFiltrosEntregaResponseDTO {
  docentes: DocenteResumenDTO[];
  estados: OpcionFiltroEstadoDTO[];
}

export interface CursoResumenDTO {
  idCurso: number;
  nombreCurso: string;
  año: number;
}

export interface PlantillaDetalleResumenDTO {
  idEjercicioPlantilla: number;
  tipo: string;
  estado: string;
}

export interface DetalleCorreccionEntregaDTO {
  estado: 'PENDIENTE' | 'EN_REVISION' | 'CORREGIDO';
  fechaCorreccion: string | null;
}

export interface DetalleEjercicioAlumnoResponseDTO {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  indicaciones: string | null;
  fechaLimite: string;
  estado: EstadoEntregaAlumno;
  bloqueado: boolean;
  fechaEntrega: string | null;
  curso: CursoResumenDTO;
  docente: DocenteResumenDTO;
  totalPlantillas: number;
  plantillasCompletadas: number;
  plantillas: PlantillaDetalleResumenDTO[];
  correccion: DetalleCorreccionEntregaDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResolucionAlumnoPlantillaItemDTO {
  idEjercicioPlantilla: number;
  tipo: string;
  estado: string;
  contenido: unknown | null;
}

export interface ResolucionAlumnoResponseDTO {
  idEntrega: number;
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  fechaLimite: string;
  bloqueado: boolean;
  fechaEntrega: string | null;
  estado: EstadoEntregaAlumno;
  curso: CursoResumenDTO;
  plantillas: ResolucionAlumnoPlantillaItemDTO[];
}

export interface GuardarPlantillaAlumnoResponseDTO {
  idResolucionPlantilla: number;
  idEjercicioPlantilla: number;
  tipo: string;
  estado: string;
  contenido: unknown | null;
}
