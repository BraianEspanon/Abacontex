import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearOrdenProduccionSchema,
  ordenProduccionIdSchema,
} from '../validators/produccion.validator';
import {
  crearOrdenProduccion,
  iniciarOrdenProduccion,
  obtenerPedidosAsociables,
  obtenerTableroProduccion,
  finalizarOrdenProduccion,
} from '../controllers/produccion.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ALUMNO), obtenerTableroProduccion);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearOrdenProduccionSchema),
  crearOrdenProduccion
);

router.get(
  '/pedidos-asociables',
  authenticate,
  requireRole(ROLES.ALUMNO),
  obtenerPedidosAsociables
);

router.patch(
  '/:idOrden/iniciar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ordenProduccionIdSchema),
  iniciarOrdenProduccion
);
router.patch(
  '/:idOrden/finalizar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ordenProduccionIdSchema),
  finalizarOrdenProduccion
);

export default router;
