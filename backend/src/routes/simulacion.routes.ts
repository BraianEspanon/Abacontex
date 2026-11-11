import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearSimulacionSchema,
  editarTituloSimulacionSchema,
  obtenerSimulacionesDocenteQuerySchema,
} from '../validators/simulacion.validator';

import {
  crearSimulacion,
  editarTituloSimulacion,
  listarSimulacionesDocente,
  obtenerOpcionesCrearSimulacion,
} from '../controllers/simulacion.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerSimulacionesDocenteQuerySchema),
  listarSimulacionesDocente
);

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

router.patch(
  '/:id/titulo',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(editarTituloSimulacionSchema),
  editarTituloSimulacion
);

export default router;
