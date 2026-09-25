import {
  OpcionTipoEjercicio,
  OpcionDificultad,
  OpcionContenidoAdicional,
} from '../../constants/ejercicio.constants';

export interface DigitalizarEjercicioResponseDTO {
  enunciadoTexto: string;
}

export interface GenerarEjercicioResponseDTO {
  enunciadoTexto: string;
}

export interface OpcionesGeneracionResponseDTO {
  tiposEjercicio: readonly OpcionTipoEjercicio[];
  dificultades: readonly OpcionDificultad[];
  contenidosAdicionales: readonly OpcionContenidoAdicional[];
}
