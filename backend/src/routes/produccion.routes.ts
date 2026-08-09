import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearOrdenProduccionSchema } from '../validators/produccion.validator';
import { crearOrdenProduccion } from '../controllers/produccion.controller';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearOrdenProduccionSchema),
  crearOrdenProduccion
);

export default router;
