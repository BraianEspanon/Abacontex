export interface CursoAnalisisErrores {
  idCurso: number;
  nombreCurso: string;
  año: number;
}

export interface KpisAnalisisErrores {
  entregasAnalizadas: number;
  errorMasFrecuente: string;
  alumnosAfectados: number;
  plantillaConMasErrores: string;
}

export interface ErrorFrecuenteCurso {
  tipoError: string;
  label: string;
  porcentaje: number;
  cantidadEntregasAfectadas: number;
}

export interface PatronDetectadoCurso {
  tipoError: string;
  label: string;
  ejerciciosAfectados: number;
  alumnosAfectados: number;
}

export interface AlumnoMasAfectadoCurso {
  idAlumno: string;
  nombre: string;
  apellido: string;
  totalErrores: number;
  ejerciciosConErrores: number;
}

export type CategoriaPlantillaAnalisis = 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'HOJA_TRABAJO' | 'IVA';

export interface DistribucionPlantillaCurso {
  categoria: CategoriaPlantillaAnalisis;
  label: string;
  cantidadErrores: number;
  porcentaje: number;
}

export interface DiagnosticoIaCurso {
  resumen: string;
  cosasAReforzar: string[];
  fechaGeneracion: string;
  puedeGenerar: boolean;
  motivoDeshabilitado: string | null;
}

export interface ControlIaAnalisis {
  puedeGenerar: boolean;
  motivoDeshabilitado: string | null;
}

export interface AnalisisErroresCursoResponse {
  curso: CursoAnalisisErrores;
  kpis: KpisAnalisisErrores;
  erroresFrecuentes: ErrorFrecuenteCurso[];
  patronesDetectados: PatronDetectadoCurso[];
  alumnosMasAfectados: AlumnoMasAfectadoCurso[];
  distribucionPlantillas: DistribucionPlantillaCurso[];
  diagnosticoIa: DiagnosticoIaCurso | null;
  controlIa: ControlIaAnalisis;
}
