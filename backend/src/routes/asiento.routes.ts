import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerTiposMovimiento,
  obtenerPendientes,
  obtenerDetallePendiente,
  crearAsientoContable,
} from '../controllers/asiento.controller';
import {
  obtenerPendientesSchema,
  obtenerDetallePendienteSchema,
  crearAsientoSchema,
} from '../validators/asiento.validator';

const router = Router();

router.get('/tipos-movimiento', authenticate, requireRole(ROLES.ALUMNO), obtenerTiposMovimiento);

router.get(
  '/pendientes',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerPendientesSchema),
  obtenerPendientes
);

router.get(
  '/pendientes/:tipo/:id',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerDetallePendienteSchema),
  obtenerDetallePendiente
);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearAsientoSchema),
  crearAsientoContable
);

export default router;
