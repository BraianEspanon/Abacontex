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
export interface EvolucionPuntajeDTO {}
export interface ActividadRecienteDTO {}
export interface AlumnoRiesgoDTO {}
export interface RankingEmpresaDTO {}
export interface ParticipacionCursoDTO {}
export interface CorreccionPendienteDTO {}
export interface AlertaDTO {}
