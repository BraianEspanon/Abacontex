import type { Curso } from './curso.types';
import type { RolEmpresa } from './rol-empresa.types';

export type TipoRegistro = 'NORMAL' | 'INVITACION';

export interface EmpresaRegistro {
  id: number;
  nombre: string;
}

export interface RegistroNormalResponse {
  tipo: 'NORMAL';
  cursos: Curso[];
  rolesEmpresa: RolEmpresa[];
}

export interface RegistroInvitacionResponse {
  tipo: 'INVITACION';
  empresa: EmpresaRegistro;
  curso: Curso;
  rolesEmpresa: RolEmpresa[];
}

export type RegistroResponse = RegistroNormalResponse | RegistroInvitacionResponse;

export interface CompletarRegistroNormalRequest {
  idCurso: number;
  idRolEmpresa: number;
}

export interface CompletarRegistroInvitacionRequest {
  idRolEmpresa: number;
}

export type CompletarRegistroRequest =
  | CompletarRegistroNormalRequest
  | CompletarRegistroInvitacionRequest;
