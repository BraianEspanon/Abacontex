import 'express';

export interface AuthUser {
  keycloakId: string;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
