import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerCategorias,
  registrarMovimiento,
} from '../controllers/movimiento-financiero.controller';
import { registrarMovimientoSchema } from '../validators/movimiento-financiero.validator';

const router = Router();

router.get('/categorias', authenticate, requireRole(ROLES.ALUMNO), obtenerCategorias);

router.post(
  '/movimientos',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(registrarMovimientoSchema),
  registrarMovimiento
);

export default router;
