export interface CursoDTO {
  id: number;
  nombre: string;
}

export interface RolEmpresaDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface EmpresaResumenDTO {
  id: number;
  nombre: string;
}

export interface UsuarioActualResponseDTO {
  registroCompleto: boolean;

  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfilUrl: string | null;

  curso: CursoDTO | null;
  rolEmpresa: RolEmpresaDTO | null;
  empresa: EmpresaResumenDTO | null;
}
