export interface IntegranteEmpresaDTO {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: string | null;
}

export interface EmpresaDetalleDocenteDTO {
  id: number;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  activa: boolean | null;
  idCurso: number;
  curso: string;
  fechaCreacion: string | null;
  cantidadIntegrantes: number;
  contactos: string[];
  integrantes: IntegranteEmpresaDTO[];
}
