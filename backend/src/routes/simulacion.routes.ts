import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearSimulacionSchema } from '../validators/simulacion.validator';

import {
  crearSimulacion,
  obtenerOpcionesCrearSimulacion,
} from '../controllers/simulacion.controller';

const router = Router();

router.get(
  '/opciones-crear',
  authenticate,
  requireRole(ROLES.DOCENTE),
  obtenerOpcionesCrearSimulacion
);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(crearSimulacionSchema),
  crearSimulacion
);

export default router;
