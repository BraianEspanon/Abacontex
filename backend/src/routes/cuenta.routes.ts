import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { registrarCuenta } from '../controllers/cuenta.controller';
import { registrarCuentaSchema } from '../validators/cuenta.validator';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(registrarCuentaSchema),
  registrarCuenta
);

export default router;
