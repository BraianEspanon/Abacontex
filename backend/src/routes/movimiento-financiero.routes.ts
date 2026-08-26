import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerCategorias,
  registrarMovimiento,
  obtenerHistorial,
  obtenerTiposMovimiento,
  obtenerResumen,
  obtenerDatosGrafico,
} from '../controllers/movimiento-financiero.controller';
import {
  registrarMovimientoSchema,
  consultarHistorialSchema,
  consultarGraficoSchema,
} from '../validators/movimiento-financiero.validator';

import conciliacionRoutes from './conciliacion.routes';

const router = Router();

router.use('/conciliaciones', conciliacionRoutes);

router.get('/categorias', authenticate, requireRole(ROLES.ALUMNO), obtenerCategorias);

router.get('/tipos-movimiento', authenticate, requireRole(ROLES.ALUMNO), obtenerTiposMovimiento);

router.get('/resumen', authenticate, requireRole(ROLES.ALUMNO), obtenerResumen);

router.get(
  '/grafico',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(consultarGraficoSchema),
  obtenerDatosGrafico
);

router.post(
  '/movimientos',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(registrarMovimientoSchema),
  registrarMovimiento
);

router.get(
  '/movimientos',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(consultarHistorialSchema),
  obtenerHistorial
);

export default router;
