import {
  OpcionDificultadSimulacion,
  OpcionDuracionSimulacion,
  OpcionFlujoEmpresarial,
  OpcionTipoEventoSorpresa,
} from '../../constants/simulacion.constants';

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
