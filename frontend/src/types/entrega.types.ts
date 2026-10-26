import type { ContenidoResolucionPlantilla, TipoPlantillaEjercicio } from './ejercicio.types';

export type EstadoEntregaAlumno =
  | 'PENDIENTE'
  | 'EN_PROGRESO'
  | 'ENTREGADO'
  | 'CORREGIDO'
  | 'VENCIDO';

export interface DocenteEntrega {
  idDocente: string;
  nombre: string;
  apellido: string;
}

export interface EjercicioAlumnoItem {
  idEjercicio: number;
  titulo: string;
  docente: DocenteEntrega;
  fechaLimite: string;
  estado: EstadoEntregaAlumno;

  totalPlantillas: number;
  plantillasCompletadas: number;

  fechaEntrega: string | null;

  bloqueado: boolean;
  tieneCorreccion: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ResumenEjerciciosAlumno {
  total: number;
  pendientes: number;
  enProgreso: number;
  entregados: number;
  corregidos: number;
  vencidos: number;
}

export interface ListadoEjerciciosAlumnoResponse {
  items: EjercicioAlumnoItem[];

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  resumen: ResumenEjerciciosAlumno;
}

export interface FiltrosEjerciciosAlumno {
  page?: number;
  pageSize?: number;

  busqueda?: string;
  docenteId?: string;

  estado?: EstadoEntregaAlumno | 'TODAS';
}

export interface OpcionEstadoEntrega {
  clave: EstadoEntregaAlumno | 'TODAS';
  label: string;
}

export interface FiltrosDisponiblesEjerciciosAlumno {
  docentes: DocenteEntrega[];
  estados: OpcionEstadoEntrega[];
}

export type EstadoPlantillaAlumno = 'PENDIENTE' | 'EN_EDICION' | 'COMPLETADA';

export interface PlantillaDetalleAlumno {
  idEjercicioPlantilla: number;
  tipo: string;
  estado: EstadoPlantillaAlumno;
}

export interface CorreccionDetalleAlumno {
  estado: 'PENDIENTE' | 'EN_REVISION' | 'CORREGIDO';
  fechaCorreccion: string | null;
}

export interface DetalleEjercicioAlumno {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  indicaciones: string | null;

  fechaLimite: string;

  estado: EstadoEntregaAlumno;

  bloqueado: boolean;
  fechaEntrega: string | null;

  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };

  docente: DocenteEntrega;

  totalPlantillas: number;
  plantillasCompletadas: number;

  plantillas: PlantillaDetalleAlumno[];

  correccion: CorreccionDetalleAlumno | null;

  createdAt: string;
  updatedAt: string;
}

export interface PlantillaResolucionAlumno {
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
  estado: EstadoPlantillaAlumno;
  contenido: ContenidoResolucionPlantilla | null;
}

export interface ResolucionAlumnoResponse {
  idEntrega: number;
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  fechaLimite: string;
  bloqueado: boolean;
  fechaEntrega: string | null;
  estado: EstadoEntregaAlumno;

  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };

  plantillas: PlantillaResolucionAlumno[];
}

export interface GuardarPlantillaAlumnoRequest {
  tipo: TipoPlantillaEjercicio;
  estado: Extract<EstadoPlantillaAlumno, 'EN_EDICION' | 'COMPLETADA'>;
  contenido: unknown;
}

export interface GuardarPlantillaAlumnoResponse {
  idResolucionPlantilla: number;
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
  estado: EstadoPlantillaAlumno;
  contenido: unknown | null;
}
