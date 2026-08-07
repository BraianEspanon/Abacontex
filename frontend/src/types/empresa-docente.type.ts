export interface EmpresaDocente {
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

export interface ResumenEmpresasDocente {
  total: number;
  activas: number | null;
  inactivas: number | null;
}

export interface EmpresasDocenteResponse {
  resumen: ResumenEmpresasDocente;
  items: EmpresaDocente[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface IntegranteEmpresaDocente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: string | null;
}

export interface EmpresaDocenteDetalle extends EmpresaDocente {
  fechaCreacion: string | null;
  integrantes: IntegranteEmpresaDocente[];
}

export interface ObtenerEmpresasDocenteParams {
  cursoId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}
