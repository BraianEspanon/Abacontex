import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerDetalleEntregaSchema,
  obtenerEntregasAlumnoQuerySchema,
} from '../validators/entrega.validator';
import {
  obtenerDetalleEjercicio,
  obtenerEntregas,
  obtenerFiltrosTablero,
} from '../controllers/entrega.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerEntregasAlumnoQuerySchema),
  obtenerEntregas
);

router.get(
  '/filtros',
  authenticate,
  requireRole(ROLES.ALUMNO),
  obtenerFiltrosTablero
);

router.get(
  '/:ejercicioId',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerDetalleEntregaSchema),
  obtenerDetalleEjercicio
);

export default router;
