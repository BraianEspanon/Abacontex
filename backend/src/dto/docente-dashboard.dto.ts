export interface DashboardDocenteDTO {
  resumen: DashboardResumenDTO;

  actividadReciente: []; //ActividadRecienteDTO[];

  alumnosRiesgo: []; //AlumnoRiesgoDTO[];

  ranking: []; //RankingEmpresaDTO[];

  participacion: []; //ParticipacionCursoDTO[];

  correcciones: []; //CorreccionPendienteDTO[];

  alertas: []; //AlertaCursoDTO[];
}
export interface DashboardResumenDTO {
  cursosActivos: number;

  empresasActivas: number;

  alumnos: number;

  ejerciciosPendientes: number;

  puntajePromedio: number | null;
}
