import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadDocumento } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';

import { generarEjercicioSchema } from '../validators/ejercicio.validator';

import { digitalizarEjercicio, generarEjercicio } from '../controllers/ejercicio.controller';

const router = Router();

router.post(
  '/digitalizar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  uploadDocumento.single('archivo'),
  digitalizarEjercicio
);

router.post(
  '/generar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(generarEjercicioSchema),
  generarEjercicio
);

export default router;
