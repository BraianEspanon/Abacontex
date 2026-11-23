export type EstadoParticipacionSimulacion = 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA';
export type EstadoFiltroSimulacionDocente = 'TODOS' | EstadoParticipacionSimulacion;
export type DificultadSimulacion = 'BASICA' | 'INTERMEDIA' | 'AVANZADA';
export type DuracionSimulacion = 'CORTA' | 'MEDIA' | 'LARGA';
export type EstadoEntregaSimulacion = 'TODOS' | EstadoParticipacionSimulacion;
export type ModoConversacionSimulacion = 'INTERACTIVO' | 'LECTURA';

export type TipoMensajeConversacion = 'SITUACION_INICIAL' | 'EVENTO' | 'DECISION_TOMADA';

export type TipoEventoSimulacion = 'DECISION' | 'INFORMATIVO' | 'FINAL';

export type ClasificacionOpcionSimulacion =
  | 'MUY_ADECUADA'
  | 'ADECUADA'
  | 'POCO_ADECUADA'
  | 'INADECUADA';

export type EstadoFiltroSimulacionAlumno =
  | 'TODAS'
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'FINALIZADA'
  | 'REQUIERE_MI_DECISION';

export interface CursoSimulacion {
  idCurso: number;
  nombreCurso: string;
}

export interface SimulacionDocenteCard {
  idSimulacion: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  fechaLimite: string;
  curso: CursoSimulacion;
  empresasQueHanEmpezado: number;
  empresasTotales: number;
  puntajePromedio: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenSimulacionesDocente {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
}

export interface ListadoSimulacionesDocenteResponse {
  items: SimulacionDocenteCard[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenSimulacionesDocente;
}

export interface FiltrosSimulacionesDocente {
  page?: number;
  pageSize?: number;
  cursoId?: number;
  titulo?: string;
  estado?: EstadoFiltroSimulacionDocente;
}

export interface CursoFiltroSimulacionDocente {
  idCurso: number;
  nombreCurso: string;
}

export interface OpcionEstadoSimulacionDocente {
  clave: EstadoFiltroSimulacionDocente;
  label: string;
}

export interface FiltrosDashboardSimulacionDocenteResponse {
  cursos: CursoFiltroSimulacionDocente[];
  estados: OpcionEstadoSimulacionDocente[];
}

export interface OpcionFlujoEmpresarial {
  id: string;
  label: string;
}

export interface OpcionDificultadSimulacion {
  id: DificultadSimulacion;
  label: string;
}

export interface OpcionDuracionSimulacion {
  id: DuracionSimulacion;
  label: string;
  subtitulo: string;
}

export interface OpcionTipoEventoSorpresa {
  id: string;
  label: string;
}

export interface OpcionesCrearSimulacionResponse {
  flujosEmpresariales: OpcionFlujoEmpresarial[];
  dificultades: OpcionDificultadSimulacion[];
  duraciones: OpcionDuracionSimulacion[];
  tiposEventoSorpresa: OpcionTipoEventoSorpresa[];
}

export interface CrearSimulacionRequest {
  cursoId: number;
  flujoEmpresarial: string;
  dificultad: DificultadSimulacion;
  duracion: DuracionSimulacion;
  eventosSorpresa: boolean;
  tipoEventoSorpresa?: string;
  usarDatosEmpresa: boolean;
  fechaLimite: string;
}

export interface SimulacionCreadaResponse {
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

export interface CabeceraEntregasSimulacion {
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

export interface EntregaSimulacionEmpresa {
  idSimulacionEmpresa: number;
  empresaId: number;
  nombreEmpresa: string;
  logoUrl: string | null;
  cantidadIntegrantes: number;
  rolesInvolucrados: string[];
  estado: EstadoParticipacionSimulacion;
  eventosCompletados: number;
  eventosTotales: number;
  porcentajeProgreso: number;
  puntajeFinal: number | null;
  ultimaActividad: string | null;
  fechaFinalizacion: string | null;
}

export interface EntregasSimulacionResponse {
  items: EntregaSimulacionEmpresa[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  simulacion: CabeceraEntregasSimulacion;
}

export interface FiltrosEntregasSimulacion {
  page?: number;
  pageSize?: number;
  search?: string;
  estado?: EstadoEntregaSimulacion;
}

export interface IntegranteSimulacion {
  idAlumno: string;
  nombre: string;
  apellido: string;
  rol: string;
  fotoPerfilUrl: string | null;
}

export interface DecisionMensajeSimulacion {
  idDecision: number;
  alumno: {
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
    fotoPerfilUrl: string | null;
  };
  opcionElegida: {
    idOpcion: number;
    codigoOpcion: string;
    texto: string;
    clasificacion?: ClasificacionOpcionSimulacion;
    cambiosSimulados?: Record<string, unknown> | null;
  };
  puntosObtenidos?: number;
  fechaDecision: string;
}

export interface MensajeConversacionSimulacion {
  id: string;
  tipoMensaje: TipoMensajeConversacion;
  tipoEvento?: TipoEventoSimulacion;
  emisor: string;
  mensaje: string;
  esSorpresa?: boolean;
  rolesHabilitados?: string[];
  fecha: string;
  decision?: DecisionMensajeSimulacion;
}

export interface OpcionDecisionActivaSimulacion {
  idOpcion: number;
  texto: string;
  clasificacion?: ClasificacionOpcionSimulacion;
}

export interface DecisionActivaSimulacion {
  idEvento: number;
  puedeDecidir: boolean;
  rolRequeridoTexto: string;
  rolesHabilitados: string[];
  opciones: OpcionDecisionActivaSimulacion[];
}

export interface ConversacionSimulacionResponse {
  idSimulacionEmpresa: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  modo: ModoConversacionSimulacion;
  progreso: {
    eventoActualNumero: number;
    cantEventosTotales: number;
    porcentajeProgreso: number;
  };
  integrantes: IntegranteSimulacion[];
  mensajes: MensajeConversacionSimulacion[];
  decisionActiva?: DecisionActivaSimulacion | null;
}

export interface FeedbackFinalSimulacion {
  resumenGeneral: string;
  fortalezas: string[];
  aspectosAMejorar: string[];
  conclusion: string;
}

export interface ResumenFinalSimulacionResponse {
  idSimulacionEmpresa: number;
  titulo: string;
  estado: EstadoParticipacionSimulacion;
  empresa: {
    id: number;
    nombre: string;
  };
  puntajeFinal: number;
  eventosCompletados: number;
  cantEventosTotales: number;
  fechaLimite: string;
  fechaFinalizacion: string | null;
  flujoEmpresarial: string;
  rolesIntervinieron: string[];
  feedbackFinal: FeedbackFinalSimulacion;
}

export interface SimulacionAlumnoCard {
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

export interface ResumenSimulacionesAlumno {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
  decisionesPorResponder: number;
}

export interface ListadoSimulacionesAlumnoResponse {
  items: SimulacionAlumnoCard[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenSimulacionesAlumno;
}

export interface FiltrosSimulacionesAlumno {
  page?: number;
  pageSize?: number;
  titulo?: string;
  estado?: EstadoFiltroSimulacionAlumno;
}

export interface OpcionEstadoSimulacionAlumno {
  clave: EstadoFiltroSimulacionAlumno;
  label: string;
}

export interface FiltrosDashboardSimulacionAlumnoResponse {
  estados: OpcionEstadoSimulacionAlumno[];
}

export interface ResponderDecisionSimulacionResponse {
  mensaje: string;
  finalizada: boolean;
}
