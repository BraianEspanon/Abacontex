import {
  TipoEjercicio,
  DificultadEjercicio,
  ContenidoAdicional,
} from '../../constants/ejercicio.constants';

export interface ConstruirPromptParams {
  cursoAño?: number;
  tipoEjercicio: TipoEjercicio;
  dificultad: DificultadEjercicio;
  contenidosAdicionales?: ContenidoAdicional[];
  contextoAdicional?: string;
}

export interface PromptGeneracionResult {
  systemInstruction: string;
  userPrompt: string;
}

export interface GeneracionEnunciadoResult {
  enunciadoTexto: string;
}

export interface IEjercicioGeneratorProvider {
  generarEnunciado(params: ConstruirPromptParams): Promise<GeneracionEnunciadoResult>;
}
