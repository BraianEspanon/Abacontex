import { PaginatedResponse } from '../paginated-response.dto';
import {
  EstadoResolucionAlumnoPlantilla,
  TipoErrorCorreccion,
  TipoPlantillaEjercicio,
} from '@prisma/client';
import {
  EstadoCorreccionAlumno,
  EstadoCorreccionEjercicio,
} from '../../constants/correccion.constants';

export interface CursoResumenCorreccionDTO {
  idCurso: number;
  nombreCurso: string;
  totalAlumnos: number;
}

export interface ItemTableroCorreccionDTO {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: CursoResumenCorreccionDTO;
  estado: EstadoCorreccionEjercicio;
  totalEntregasRecibidas: number;
  cantidadSinEntregar: number;
  entregasCorregidas: number;
  entregasEnCorreccion: number;
  entregasPendientes: number;
  tieneResolucionDocente: boolean;
  createdAt: string;
}

export interface ResumenTableroCorreccionesDTO {
  total: number;
  sinEntregas: number;
  pendientes: number;
  enCorreccion: number;
  corregidos: number;
}

export interface ListadoEjerciciosACorregirResponseDTO extends PaginatedResponse<ItemTableroCorreccionDTO> {
  resumen: ResumenTableroCorreccionesDTO;
}

export interface CursoFiltroDTO {
  idCurso: number;
  nombreCurso: string;
}

export interface OpcionFiltroEstadoCorreccionDTO {
  clave: string;
  label: string;
}

export interface OpcionesFiltrosCorreccionResponseDTO {
  cursos: CursoFiltroDTO[];
  estados: OpcionFiltroEstadoCorreccionDTO[];
}

export interface CabeceraEjercicioEntregasDTO {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  plantillasHabilitadas: string[];
  totalAlumnos: number;
  totalEntregasRecibidas: number;
  entregasCorregidas: number;
  entregasPendientes: number;
  cantidadSinEntregar: number;
  tieneResolucionDocente: boolean;
}

export interface ItemAlumnoEntregaDTO {
  idAlumno: string;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfilUrl: string | null;
  idEntrega: number | null;
  fechaEntrega: string | null;
  fueraDeTermino: boolean;
  estado: EstadoCorreccionAlumno;
  totalPlantillas: number;
  plantillasResueltas: number;
  plantillasCorregidas: number;
  tieneRetroalimentacion: boolean;
}

export interface FiltrosEntregasEjercicioDTO {
  estados: OpcionFiltroEstadoCorreccionDTO[];
}

export interface ListadoEntregasEjercicioResponseDTO extends PaginatedResponse<ItemAlumnoEntregaDTO> {
  ejercicio: CabeceraEjercicioEntregasDTO;
  filtros: FiltrosEntregasEjercicioDTO;
}

export interface KpisCorreccionDTO {
  aciertos: number;
  diferenciasDetectadas: number;
  asientosIncompletos: number;
  totalErrores: number;
}

export interface ControlAsistenciaIaDTO {
  puedeSugerirIa: boolean;
  motivoDeshabilitadoIa: string | null;
}

export interface ErrorDetalleItemDTO {
  idError: number | null;
  ejercicioPlantillaId: number;
  tipoError: TipoErrorCorreccion;
  detalle: Record<string, unknown>;
  comentarioDocente: string | null;
}

export type EstadoRevisionPlantillaDTO = 'PENDIENTE' | 'CORREGIDA';

export interface PlantillaEspacioTrabajoDTO {
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
  nombre: string;
  estadoRevision: EstadoRevisionPlantillaDTO;
  estadoAlumno: EstadoResolucionAlumnoPlantilla;
  contenidoAlumno: unknown;
  contenidoDocente: unknown;
  errores: ErrorDetalleItemDTO[];
}

export interface AlumnoEspacioTrabajoDTO {
  idAlumno: string;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfilUrl: string | null;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
}

export interface EntregaDetalleEspacioTrabajoDTO {
  idEntrega: number;
  fechaEntrega: string | null;
  fueraDeTermino: boolean;
}

export interface EjercicioEspacioTrabajoDTO {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  indicaciones: string | null;
  fechaLimite: string;
  totalPlantillas: number;
  plantillasResueltas: number;
  tieneResolucionDocente: boolean;
}

export interface EspacioTrabajoCorreccionResponseDTO {
  alumno: AlumnoEspacioTrabajoDTO;
  entrega: EntregaDetalleEspacioTrabajoDTO;
  ejercicio: EjercicioEspacioTrabajoDTO;
  kpis: KpisCorreccionDTO;
  controlIa: ControlAsistenciaIaDTO;
  retroalimentacionBorrador: string | null;
  plantillas: PlantillaEspacioTrabajoDTO[];
}

export interface KpisAnalisisErroresCursoDTO {
  entregasAnalizadas: number;
  errorMasFrecuente: string;
  alumnosAfectados: number;
  plantillaConMasErrores: string;
}

export interface ErrorFrecuenteCursoDTO {
  tipoError: string;
  label: string;
  porcentaje: number;
  cantidadEntregasAfectadas: number;
}

export interface PatronDetectadoCursoDTO {
  tipoError: string;
  label: string;
  ejerciciosAfectados: number;
  alumnosAfectados: number;
}

export interface AlumnoMasAfectadoCursoDTO {
  idAlumno: string;
  nombre: string;
  apellido: string;
  totalErrores: number;
  ejerciciosConErrores: number;
}

export interface DistribucionPlantillaCursoDTO {
  categoria: 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'HOJA_TRABAJO' | 'IVA';
  label: string;
  cantidadErrores: number;
  porcentaje: number;
}

export interface DiagnosticoIaCursoDTO {
  resumen: string;
  cosasAReforzar: string[];
  fechaGeneracion: string;
  puedeGenerar: boolean;
  motivoDeshabilitado: string | null;
}

export interface DiagnosticoIaControlDTO {
  puedeGenerar: boolean;
  motivoDeshabilitado: string | null;
}

export interface AnalisisErroresCursoResponseDTO {
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };
  kpis: KpisAnalisisErroresCursoDTO;
  erroresFrecuentes: ErrorFrecuenteCursoDTO[];
  patronesDetectados: PatronDetectadoCursoDTO[];
  alumnosMasAfectados: AlumnoMasAfectadoCursoDTO[];
  distribucionPlantillas: DistribucionPlantillaCursoDTO[];
  diagnosticoIa: DiagnosticoIaCursoDTO | null;
  controlIa: DiagnosticoIaControlDTO;
}
