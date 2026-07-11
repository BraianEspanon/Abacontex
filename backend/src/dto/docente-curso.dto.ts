export interface CursoDocenteDTO {
  id: number;

  nombre: string;

  empresasActivas: number;

  alumnos: number;

  participacionPromedio: number | null;

  puntajePromedioEmpresarial: number | null;

  ultimaActividad: UltimaActividadDTO | null;
}

export interface UltimaActividadDTO {
  fecha: Date;

  descripcion: string;

  empresa: string;
}
