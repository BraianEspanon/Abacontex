export interface DashboardDocenteFiltrosDTO {
  cursoId?: number;
  cicloLectivo?: number;
}
export interface DashboardDocenteDTO {
  resumen: DashboardResumenDTO;

  evolucionPuntaje: EvolucionPuntajeDTO[];

  actividadReciente: ActividadRecienteDTO[]; //ActividadRecienteDTO[];

  alumnosRiesgo: AlumnoRiesgoDTO[]; //AlumnoRiesgoDTO[];

  ranking: RankingEmpresaDTO[]; //

  participacion: ParticipacionCursoDTO[]; //ParticipacionCursoDTO[];

  correcciones: CorreccionPendienteDTO[]; //CorreccionPendienteDTO[];

  alertas: AlertaDTO[]; //AlertaCursoDTO[];
}

export interface DashboardResumenDTO {
  cursosActivos: number;
  empresasActivas: number;
  alumnos: number;
  ejerciciosPendientes: number;
  puntajePromedio: number | null;
}
export interface EvolucionPuntajeDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface ActividadRecienteDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface AlumnoRiesgoDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface RankingEmpresaDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface ParticipacionCursoDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface CorreccionPendienteDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
export interface AlertaDTO {
  // TODO: definir cuando se implemente la actividad reciente
  id: string;
}
