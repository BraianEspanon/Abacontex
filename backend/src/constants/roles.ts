export const ROLES = {
  ADMIN: 'ADMIN',
  DOCENTE: 'DOCENTE',
  ALUMNO: 'ALUMNO',
} as const;

export type RolSistema =
  (typeof ROLES)[keyof typeof ROLES];