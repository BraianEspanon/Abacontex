import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerCategorias,
  registrarMovimiento,
  obtenerHistorial,
  obtenerTiposMovimiento,
} from '../controllers/movimiento-financiero.controller';
import {
  registrarMovimientoSchema,
  consultarHistorialSchema,
} from '../validators/movimiento-financiero.validator';

const router = Router();

router.get('/categorias', authenticate, requireRole(ROLES.ALUMNO), obtenerCategorias);

router.get('/tipos-movimiento', authenticate, requireRole(ROLES.ALUMNO), obtenerTiposMovimiento);

router.post(
  '/movimientos',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(registrarMovimientoSchema),
  registrarMovimiento
);

router.get(
  '/movimientos',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(consultarHistorialSchema),
  obtenerHistorial
);

export default router;
