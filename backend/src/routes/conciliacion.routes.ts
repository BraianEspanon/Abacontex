import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

import { obtenerResumen } from '../controllers/conciliacion.controller';

const router = Router();

router.get('/resumen', authenticate, requireRole(ROLES.ALUMNO), obtenerResumen);

export default router;
