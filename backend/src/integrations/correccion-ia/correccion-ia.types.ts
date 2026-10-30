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

export interface ItemErrorDistribucionIa {
  tipoError: string;
  label: string;
  porcentaje: number;
  cantidadEntregasAfectadas: number;
}

export interface GenerarDiagnosticoCursoParams {
  nombreCurso: string;
  totalErrores: number;
  totalEntregas: number;
  errorPrincipal: string;
  plantillaPrincipal: string;
  distribucionErrores: ItemErrorDistribucionIa[];
}

export interface DiagnosticoCursoIaResult {
  resumenGeneral: string;
  cosasAReforzar: string[];
}

export interface ICorreccionIaProvider {
  generarSugerenciaRetroalimentacion(params: GenerarSugerenciaEntregaParams): Promise<string>;
  generarDiagnosticoCurso(params: GenerarDiagnosticoCursoParams): Promise<DiagnosticoCursoIaResult>;
}
