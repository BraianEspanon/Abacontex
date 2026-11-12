import {
  EstadoParticipacionSimulacion,
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
  estado: EstadoParticipacionSimulacion;
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

export interface CabeceraEntregasSimulacionDTO {
  idSimulacion: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  fechaLimite: string;
  fechaFinalizacion: string | null;
  tema: string;
  cantEventosTotales: number;
  empresasTotales: number;
  empresasQueHanEmpezado: number;
  puntajePromedio: number | null;
}

export interface EntregaSimulacionEmpresaItemDTO {
  idSimulacionEmpresa: number;
  empresaId: number;
  nombreEmpresa: string;
  logoUrl: string | null;
  cantidadIntegrantes: number;
  rolesInvolucrados: string[];
  estado: string;
  eventosCompletados: number;
  eventosTotales: number;
  porcentajeProgreso: number;
  puntajeFinal: number | null;
  ultimaActividad: string | null;
  fechaFinalizacion: string | null;
}

export interface EntregasSimulacionResponseDTO extends PaginatedResponse<EntregaSimulacionEmpresaItemDTO> {
  simulacion: CabeceraEntregasSimulacionDTO;
}

export interface SimulacionAlumnoCardDTO {
  idSimulacionEmpresa: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  requiereMiDecision: boolean;
  eventoActualNumero: number;
  cantEventosTotales: number;
  porcentajeProgreso: number;
  fechaLimite: string;
  ultimaActividad: string | null;
}

export interface ResumenDashboardAlumnoDTO {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
  decisionesPorResponder: number;
}

export interface ListarSimulacionesAlumnoResponseDTO
  extends PaginatedResponse<SimulacionAlumnoCardDTO> {
  resumen: ResumenDashboardAlumnoDTO;
}
