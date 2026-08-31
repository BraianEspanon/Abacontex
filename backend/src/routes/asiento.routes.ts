import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerTiposMovimiento, obtenerPendientes } from '../controllers/asiento.controller';
import { obtenerPendientesSchema } from '../validators/asiento.validator';

const router = Router();

router.get('/tipos-movimiento', authenticate, requireRole(ROLES.ALUMNO), obtenerTiposMovimiento);

router.get(
  '/pendientes',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerPendientesSchema),
  obtenerPendientes
);

export default router;
