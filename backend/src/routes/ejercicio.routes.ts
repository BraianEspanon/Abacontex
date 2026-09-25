import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadDocumento } from '../middleware/upload.middleware';

import { digitalizarEjercicio } from '../controllers/ejercicio.controller';

const router = Router();

router.post(
  '/digitalizar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  uploadDocumento.single('archivo'),
  digitalizarEjercicio
);

export default router;
