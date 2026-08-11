import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearPlanificacionSchema } from '../validators/planificacion.validator';
import { crearPlanificacion } from '../controllers/planificacion.controller';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearPlanificacionSchema),
  crearPlanificacion
);

export default router;
