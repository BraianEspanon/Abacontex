import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  registrarCuenta,
  obtenerTiposCuenta,
  editarCuenta,
} from '../controllers/cuenta.controller';
import { registrarCuentaSchema, editarCuentaSchema } from '../validators/cuenta.validator';

const router = Router();

router.get('/tipos', authenticate, requireRole(ROLES.ALUMNO, ROLES.DOCENTE), obtenerTiposCuenta);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(registrarCuentaSchema),
  registrarCuenta
);

router.patch(
  '/:idCuenta',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(editarCuentaSchema),
  editarCuenta
);

export default router;
