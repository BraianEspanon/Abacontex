import type { Curso } from './curso.types';

export type EstadoInvitacionActiva = 'PENDIENTE' | 'ACEPTADA';

export interface EmpresaInvitacion {
  id: number;
  nombre: string;
  actividad: string | null;
  logoUrl: string | null;
  idCurso: number;
  activo: boolean;
  curso: Curso;
}

export interface Invitador {
  nombre: string;
  apellido: string;
}

export interface Invitacion {
  id: number;
  estado: EstadoInvitacionActiva;
  empresa: EmpresaInvitacion;
  createdBy: Invitador;
  fechaExpiracion: string;
}
