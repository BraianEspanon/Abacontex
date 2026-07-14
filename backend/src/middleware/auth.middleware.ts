import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

import { JWKS, KEYCLOAK_ISSUER } from '../config/keycloak';
import { UnauthorizedError } from '../errors/unauthorized.error';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Debes autenticarte para acceder a este recurso.', {
      reason: 'TOKEN_MISSING',
    });
  }

  const token = authHeader.substring(7);

  let payload;

  try {
    ({ payload } = await jwtVerify(token, JWKS, {
      issuer: KEYCLOAK_ISSUER,
    }));
  } catch {
    throw new UnauthorizedError('La sesión ha expirado o el token es inválido.', {
      reason: 'TOKEN_INVALID',
    });
  }

  req.user = {
    keycloakId: payload.sub as string,
    username: payload.preferred_username as string,
    email: payload.email as string,
    nombre: payload.given_name as string,
    apellido: payload.family_name as string,
    roles: (payload.realm_access as { roles?: string[] })?.roles ?? [],
  };

  next();
}
