import { PaginatedResponse } from '../paginated-response.dto';

export interface HistorialConciliacionItemDTO {
  idConciliacion: number;
  fecha: Date;
  alumno: string;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  observacion: string | null;
}

export type HistorialConciliacionesResponseDTO = PaginatedResponse<HistorialConciliacionItemDTO>;
