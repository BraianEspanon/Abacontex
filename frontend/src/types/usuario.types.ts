export interface RolSistema {
  idRol: number;
  nombreRol: string;
}

export interface UsuarioActual {
  id: string;
  keycloakId: string;
  email: string;
  nombre: string;
  apellido: string;
  rolSistema: RolSistema;
  cursos: unknown[];
}