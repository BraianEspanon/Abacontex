import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearPedido, obtenerDetallePedido } from '../controllers/pedido.controller';

import { crearPedidoSchema, obtenerDetallePedidoSchema } from '../validators/pedido.validator';

const router = Router();

router.post('/', authenticate, requireRole(ROLES.ALUMNO), validate(crearPedidoSchema), crearPedido);
router.get(
  '/:idPedido',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerDetallePedidoSchema),
  obtenerDetallePedido
);

export default router;
