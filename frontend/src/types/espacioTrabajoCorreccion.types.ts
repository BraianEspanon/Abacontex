export type EstadoRevisionPlantilla = 'PENDIENTE' | 'CORREGIDA';

export interface ErrorDetalleCorreccion {
  idError: number | null;
  ejercicioPlantillaId: number;
  tipoError: string;
  detalle: Record<string, unknown>;
  comentarioDocente: string | null;
}

export interface PlantillaEspacioTrabajo {
  idEjercicioPlantilla: number;
  tipo: string;
  nombre: string;
  estadoRevision: EstadoRevisionPlantilla;
  estadoAlumno: string;
  contenidoAlumno: unknown;
  contenidoDocente: unknown;
  errores: ErrorDetalleCorreccion[];
}

export interface EspacioTrabajoCorreccion {
  alumno: {
    idAlumno: string;
    nombre: string;
    apellido: string;
    email: string;
    fotoPerfilUrl: string | null;
    curso: {
      idCurso: number;
      nombreCurso: string;
    };
  };
  entrega: {
    idEntrega: number;
    fechaEntrega: string | null;
    fueraDeTermino: boolean;
  };
  ejercicio: {
    idEjercicio: number;
    titulo: string;
    enunciado: string;
    indicaciones: string | null;
    fechaLimite: string;
    totalPlantillas: number;
    plantillasResueltas: number;
    tieneResolucionDocente: boolean;
  };
  kpis: {
    aciertos: number;
    diferenciasDetectadas: number;
    asientosIncompletos: number;
    totalErrores: number;
  };
  controlIa: {
    puedeSugerirIa: boolean;
    motivoDeshabilitadoIa: string | null;
  };
  retroalimentacionBorrador: string | null;
  plantillas: PlantillaEspacioTrabajo[];
}

export interface RevisionPlantillaRequest {
  estado: EstadoRevisionPlantilla;
}

export interface RevisionPlantillaResponse {
  idCorreccionPlantilla: number;
  idEjercicioPlantilla: number;
  estado: EstadoRevisionPlantilla;
  mensaje: string;
}

export interface RetroalimentacionRequest {
  retroalimentacion?: string;
}

export interface BorradorCorreccionResponse {
  idCorreccion: number;
  entregaId: number;
  retroalimentacion: string | null;
  mensaje: string;
}

export interface ComentarioErrorRequest {
  idError?: number;
  ejercicioPlantillaId: number;
  tipoError: string;
  detalle: Record<string, unknown>;
  comentario?: string | null;
}

export interface ComentarioErrorResponse {
  idError: number;
  ejercicioPlantillaId: number;
  tipoError: string;
  comentarioDocente: string | null;
  mensaje: string;
}

export interface SugerenciaRetroalimentacionResponse {
  sugerencia: string;
}

export interface FinalizarCorreccionResponse {
  idCorreccion: number;
  entregaId: number;
  fechaCorreccion: string;
  retroalimentacion: string | null;
  totalErrores: number;
  mensaje: string;
}
