import { PaginatedResponse } from '../paginated-response.dto';
export interface AlumnoDocenteDTO {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  curso: string;
  empresa: string | null;
  participacion: number | null;
  ejerciciosRealizados: number | null;
  ultimaActividad: string | null;
  estado: string | null;
}

export interface AlumnosDocenteResponseDTO extends PaginatedResponse<AlumnoDocenteDTO> {
  resumen: {
    total: number;
    activos: number | null;
    enRiesgo: number | null;
    tareasPendientes: number | null;
    promedioGeneral: number | null;
  };
}
