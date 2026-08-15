import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearPedido,
  obtenerDetallePedido,
  obtenerPedidos,
  marcarPedidoListoParaEntregar,
} from '../controllers/pedido.controller';

import { crearPedidoSchema, pedidoIdSchema } from '../validators/pedido.validator';

const router = Router();

router.post('/', authenticate, requireRole(ROLES.ALUMNO), validate(crearPedidoSchema), crearPedido);
router.get('/', authenticate, requireRole(ROLES.ALUMNO), obtenerPedidos);
router.get(
  '/:idPedido',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(pedidoIdSchema),
  obtenerDetallePedido
);

// CAMBIOS DE ESTADO
router.patch(
  '/:idPedido/listo-para-entregar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(pedidoIdSchema),
  marcarPedidoListoParaEntregar
);

export default router;
