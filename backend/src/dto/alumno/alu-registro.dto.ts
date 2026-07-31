export interface CursoDTO {
  idCurso: number;
  nombreCurso: string;
}

export interface RolEmpresaDTO {
  idRol: number;
  nombreRol: string;
  descripcion: string | null;
}

export interface EmpresaResumenDTO {
  id: number;
  nombre: string;
}

export type RegistroResponseDTO =
  | {
      tipo: 'NORMAL';

      cursos: CursoDTO[];

      rolesEmpresa: RolEmpresaDTO[];
    }
  | {
      tipo: 'INVITACION';

      empresa: EmpresaResumenDTO;

      curso: CursoDTO;

      rolesEmpresa: RolEmpresaDTO[];
    };
