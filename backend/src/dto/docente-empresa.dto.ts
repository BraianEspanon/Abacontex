export interface ResumenEmpresasDocenteDTO {
  total: number;
  activas: number | null;
  inactivas: number | null;
}

export interface EmpresaDocenteDTO {
  id: number;

  nombre: string;

  actividad: string;

  logoUrl: string | null;

  activa: boolean | null;

  idCurso: number;

  curso: string;

  cantidadIntegrantes: number;

  contactos: string[];
}
