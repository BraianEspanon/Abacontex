import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerPedidosListos } from '../controllers/venta.controller';

const router = Router();

router.get('/pedidos-listos', authenticate, requireRole(ROLES.ALUMNO), obtenerPedidosListos);

export default router;
