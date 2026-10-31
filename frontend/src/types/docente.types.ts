export interface CursoDocente {
  id: number;
  nombre: string;
}

export interface CursoDocenteResumen {
  id: number;
  nombre: string;
  empresasActivas: number;
  alumnos: number;
  participacionPromedio: number | null;
  puntajePromedioEmpresarial: number | null;
  ultimaActividad: unknown | null;
}

export interface DocenteActual {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cursos: CursoDocente[];
}

export interface CrearDocenteRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  cursoIds: number[];
}

export interface DocenteCreado {
  id: string;
  keycloakId: string;
  email: string;
  nombre: string;
  apellido: string;
  rolSistemaId: number;
  fotoPerfilUrl: string | null;
  fechaAlta: string;
}

export interface DashboardResumenDocente {
  cursosActivos: number;
  empresasActivas: number;
  alumnos: number;
  ejerciciosPendientes: number;
  puntajePromedio: number | null;
}

export interface DashboardItemPendiente {
  id: string;
}

export interface DashboardDocente {
  resumen: DashboardResumenDocente;
  evolucionPuntaje: DashboardItemPendiente[];
  actividadReciente: DashboardItemPendiente[];
  alumnosRiesgo: DashboardItemPendiente[];
  ranking: DashboardItemPendiente[];
  participacion: DashboardItemPendiente[];
  correcciones: DashboardItemPendiente[];
  alertas: DashboardItemPendiente[];
}
