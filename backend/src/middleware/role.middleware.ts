import { Request, Response, NextFunction } from 'express';

export function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles ?? [];

    const autorizado = userRoles.some((role) => rolesPermitidos.includes(role));

    if (!autorizado) {
      return res.status(403).json({
        message: 'No autorizado',
      });
    }

    next();
  };
}
