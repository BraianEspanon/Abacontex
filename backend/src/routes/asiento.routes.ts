import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

import { obtenerTiposMovimiento } from '../controllers/asiento.controller';

const router = Router();

router.get(
  '/tipos-movimiento',
  authenticate,
  requireRole(ROLES.ALUMNO, ROLES.DOCENTE),
  obtenerTiposMovimiento
);

export default router;
