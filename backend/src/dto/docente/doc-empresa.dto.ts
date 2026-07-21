import { PaginatedResponse } from '../paginated-response.dto';

export interface EmpresasDocenteResponseDTO extends PaginatedResponse<EmpresaDocenteDTO> {
  resumen: ResumenEmpresasDocenteDTO;
}

export interface ResumenEmpresasDocenteDTO {
  total: number;
  activas: number | null;
  inactivas: number | null;
}

export interface EmpresaDocenteDTO {
  id: number;

  nombre: string;

  actividad: string;

  logoUrl: string | null;

  activa: boolean | null;

  idCurso: number;

  curso: string;

  cantidadIntegrantes: number;

  contactos: string[];
}
