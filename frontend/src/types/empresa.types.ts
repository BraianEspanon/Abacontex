export interface RolEmpresaCandidato {
  id: number;
  nombre: string;
}

export interface AlumnoDisponible {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: RolEmpresaCandidato | null;
}

export interface InvitacionPendiente {
  id: string;
  email: string;
}

export interface DatosNuevaEmpresa {
  nombre: string;
  actividad: string;
  logo?: File | null;
  integrantesIds: string[];
  invitaciones: string[];
}