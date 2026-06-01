import 'express';

export interface AuthUser {
  id: string;
  username: string;
  roles?: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};