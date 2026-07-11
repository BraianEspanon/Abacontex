import { PaginatedResponse } from './paginated-response.dto';
import { EmpresaDocenteDTO, ResumenEmpresasDocenteDTO } from './docente-empresa.dto';

export interface EmpresasDocenteResponseDTO extends PaginatedResponse<EmpresaDocenteDTO> {
  resumen: ResumenEmpresasDocenteDTO;
}
