import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  actualizarPlanificacionMensualSchema,
  crearPlanificacionSchema,
} from '../validators/planificacion.validator';
import {
  obtenerPlanificacionAnual,
  crearPlanificacion,
  actualizarPlanificacionMensual,
} from '../controllers/planificacion.controller';

const router = Router();

router.get('/', authenticate, requireRole(ROLES.ALUMNO), obtenerPlanificacionAnual);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearPlanificacionSchema),
  crearPlanificacion
);

router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(actualizarPlanificacionMensualSchema),
  actualizarPlanificacionMensual
);

export default router;
