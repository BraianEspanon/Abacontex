import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

import { obtenerMetodosPagoDisponibles } from '../controllers/metodo-pago.controller';

const router = Router();

router.get('/me', authenticate, requireRole(ROLES.ALUMNO), obtenerMetodosPagoDisponibles);

export default router;
