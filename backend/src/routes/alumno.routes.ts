import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ROLES } from '../constants/roles';
import { completarRegistroSchema } from '../validators/alumno.validator';
import { validate } from '../middleware/validate.middleware';
import { requireRole } from '../middleware/role.middleware';

import { getAlumnoActual, completarRegistro } from '../controllers/alumno.controller';

const router = Router();

router.get('/me', authenticate, requireRole(ROLES.ALUMNO), getAlumnoActual);
router.patch(
  '/me/registro',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(completarRegistroSchema),
  completarRegistro
);

export default router;
