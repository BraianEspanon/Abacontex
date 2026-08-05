import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearPedido } from '../controllers/pedido.controller';

import { crearPedidoSchema } from '../validators/pedido.validator';

const router = Router();

router.post('/', authenticate, requireRole(ROLES.ALUMNO), validate(crearPedidoSchema), crearPedido);

export default router;
