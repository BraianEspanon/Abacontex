import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerDetalleVenta,
  obtenerPedidosListos,
  obtenerVentas,
  registrarVenta,
} from '../controllers/venta.controller';

import {
  obtenerDetalleVentaSchema,
  obtenerVentasQuerySchema,
  registrarVentaSchema,
} from '../validators/venta.validator';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(registrarVentaSchema),
  registrarVenta
);

router.get(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerVentasQuerySchema),
  obtenerVentas
);

router.get('/pedidos-listos', authenticate, requireRole(ROLES.ALUMNO), obtenerPedidosListos);

router.get(
  '/:idVenta',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerDetalleVentaSchema),
  obtenerDetalleVenta
);

export default router;
