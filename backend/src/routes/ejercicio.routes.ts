import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { uploadDocumento } from '../middleware/upload.middleware';

import { digitalizarEjercicio } from '../controllers/ejercicio.controller';
import { digitalizarEjercicioSchema } from '../validators/ejercicio.validator';

const router = Router();

router.post(
  '/digitalizar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  uploadDocumento.single('archivo'),
  validate(digitalizarEjercicioSchema),
  digitalizarEjercicio
);

export default router;
