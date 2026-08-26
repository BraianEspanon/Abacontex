import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerResumen, registrar } from '../controllers/conciliacion.controller';

import { registrarConciliacionSchema } from '../validators/conciliacion.validator';

const router = Router();

router.get('/resumen', authenticate, requireRole(ROLES.ALUMNO), obtenerResumen);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(registrarConciliacionSchema),
  registrar
);

export default router;
