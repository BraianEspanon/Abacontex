import {
  OpcionDificultadSimulacion,
  OpcionDuracionSimulacion,
  OpcionFlujoEmpresarial,
  OpcionTipoEventoSorpresa,
} from '../../constants/simulacion.constants';
import { PaginatedResponse } from '../paginated-response.dto';

export interface SimulacionCreadaResponseDTO {
  idSimulacion: number;
  titulo: string;
  flujoEmpresarial: string;
  dificultad: string;
  duracion: string;
  eventosSorpresa: boolean;
  usarDatosEmpresa: boolean;
  fechaLimite: string;
  estado: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };
  empresasParticipantes: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpcionesCrearSimulacionResponseDTO {
  flujosEmpresariales: readonly OpcionFlujoEmpresarial[];
  dificultades: readonly OpcionDificultadSimulacion[];
  duraciones: readonly OpcionDuracionSimulacion[];
  tiposEventoSorpresa: readonly OpcionTipoEventoSorpresa[];
}

export interface SimulacionDocenteCardDTO {
  idSimulacion: number;
  titulo: string;
  estado: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA';
  fechaLimite: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  empresasQueHanEmpezado: number;
  empresasTotales: number;
  puntajePromedio: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenDashboardDocenteDTO {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
}

export interface ListarSimulacionesDocenteResponseDTO extends PaginatedResponse<SimulacionDocenteCardDTO> {
  resumen: ResumenDashboardDocenteDTO;
}

export interface EditarTituloSimulacionResponseDTO {
  idSimulacion: number;
  titulo: string;
  updatedAt: string;
}
