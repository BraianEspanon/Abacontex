import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden.error';

export function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles ?? [];

    const visibleRoles = userRoles.filter(
      (role) => !['default-roles-abacontex', 'offline_access', 'uma_authorization'].includes(role)
    );

    const autorizado = visibleRoles.some((role) => rolesPermitidos.includes(role));

    if (!autorizado) {
      throw new ForbiddenError('No tienes permisos para realizar esta acción.', {
        requiredRoles: rolesPermitidos,
        userRoles: visibleRoles,
      });
    }

    next();
  };
}
