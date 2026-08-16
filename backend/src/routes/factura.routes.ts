import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerVentasPendientesFacturacion,
  generarFactura,
  obtenerDetalleFactura,
} from '../controllers/factura.controller';
import {
  obtenerVentasPendientesSchema,
  generarFacturaSchema,
  obtenerDetalleFacturaSchema,
} from '../validators/factura.validator';

const router = Router();

router.get(
  '/ventas-pendientes',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerVentasPendientesSchema),
  obtenerVentasPendientesFacturacion
);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(generarFacturaSchema),
  generarFactura
);

router.get(
  '/:idFactura',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerDetalleFacturaSchema),
  obtenerDetalleFactura
);

export default router;
