import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

import { JWKS, KEYCLOAK_ISSUER } from '../config/keycloak';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Missing token',
      });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: KEYCLOAK_ISSUER,
    });

    req.user = {
      keycloakId: payload.sub as string,
      username: payload.preferred_username as string,
      email: payload.email as string,
      nombre: payload.given_name as string,
      apellido: payload.family_name as string,
      roles: (payload.realm_access as any)?.roles ?? [],
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}
