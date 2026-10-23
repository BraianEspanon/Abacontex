import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerEjerciciosACorregirQuerySchema } from '../validators/correccion.validator';

import { obtenerEjerciciosACorregir } from '../controllers/correccion.controller';

const router = Router();

router.get(
  '/ejercicios',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEjerciciosACorregirQuerySchema),
  obtenerEjerciciosACorregir
);

export default router;
