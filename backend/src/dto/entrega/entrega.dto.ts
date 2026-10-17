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
