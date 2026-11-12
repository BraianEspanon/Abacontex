export type EstadoCorreccionEjercicio =
  | 'SIN_ENTREGAS'
  | 'PENDIENTE'
  | 'EN_CORRECCION'
  | 'CORREGIDO';

export interface CursoResumenCorreccion {
  idCurso: number;
  nombreCurso: string;
  totalAlumnos: number;
}

export interface EjercicioCorreccion {
  idEjercicio: number;
  titulo: string;
  fechaLimite: string;
  curso: CursoResumenCorreccion;
  estado: EstadoCorreccionEjercicio;
  totalEntregasRecibidas: number;
  cantidadSinEntregar: number;
  entregasCorregidas: number;
  entregasEnCorreccion: number;
  entregasPendientes: number;
  tieneResolucionDocente: boolean;
  createdAt: string;
}

export interface ResumenCorrecciones {
  total: number;
  sinEntregas: number;
  pendientes: number;
  enCorreccion: number;
  corregidos: number;
}

export interface CorreccionesResponse {
  items: EjercicioCorreccion[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenCorrecciones;
}

export interface FiltrosCorreccionesParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  cursoId?: number;
  estado?: EstadoCorreccionEjercicio | 'TODAS';
}

export type EstadoCorreccionAlumno = 'SIN_ENTREGAR' | 'PENDIENTE' | 'EN_CORRECCION' | 'CORREGIDA';

export interface CursoFiltroCorreccion {
  idCurso: number;
  nombreCurso: string;
}

export interface OpcionFiltroCorreccion {
  clave: string;
  label: string;
}

export interface FiltrosTableroCorreccionResponse {
  cursos: CursoFiltroCorreccion[];
  estados: OpcionFiltroCorreccion[];
}

export interface CabeceraEjercicioEntregas {
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

export interface AlumnoEntregaCorreccion {
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

export interface FiltrosEntregasCorreccion {
  estados: OpcionFiltroCorreccion[];
}

export interface EntregasEjercicioResponse {
  items: AlumnoEntregaCorreccion[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  ejercicio: CabeceraEjercicioEntregas;
  filtros: FiltrosEntregasCorreccion;
}

export interface ParametrosEntregasCorreccion {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  estado?: EstadoCorreccionAlumno | 'TODAS';
}
