import 'express';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
