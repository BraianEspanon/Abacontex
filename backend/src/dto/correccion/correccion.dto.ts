import { PaginatedResponse } from '../paginated-response.dto';
import { EstadoCorreccionEjercicio } from '../../constants/correccion.constants';

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
