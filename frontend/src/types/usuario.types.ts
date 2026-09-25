export interface RolSistema {
  idRol: number;
  nombreRol: string;
}

export interface CursoAsignado {
  idCurso: number;
  nombreCurso: string;
  cantidadAlumnos?: number;
}

export interface UsuarioActual {
  id: string;
  keycloakId: string;
  email: string;
  nombre: string;
  apellido: string;
  fotoPerfilUrl?: string | null;
  fechaAlta?: string;
  activo?: boolean;
  rolSistema?: RolSistema;
  cursos?: CursoAsignado[];
}
export interface ActualizarUsuarioActualRequest {
  nombre: string;
  apellido: string;
  foto?: File | null;
  eliminarFoto?: boolean;
}

export interface ActualizarPasswordRequest {
  currentPassword: string;
  newPassword: string;
}
