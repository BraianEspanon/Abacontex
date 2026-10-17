import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerEntregasAlumnoQuerySchema } from '../validators/entrega.validator';
import { obtenerEntregas } from '../controllers/entrega.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerEntregasAlumnoQuerySchema),
  obtenerEntregas
);

export default router;
