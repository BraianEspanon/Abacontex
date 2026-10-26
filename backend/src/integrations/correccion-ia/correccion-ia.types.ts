import { TipoErrorCorreccion } from '@prisma/client';

export interface ErrorResumenIa {
  plantilla: string;
  tipoError: TipoErrorCorreccion;
  detalle: Record<string, unknown>;
}

export interface GenerarSugerenciaEntregaParams {
  tituloEjercicio: string;
  enunciado?: string;
  errores: ErrorResumenIa[];
}

export interface ICorreccionIaProvider {
  generarSugerenciaRetroalimentacion(params: GenerarSugerenciaEntregaParams): Promise<string>;
}
