import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearSimulacionSchema,
  editarTituloSimulacionSchema,
  obtenerEntregasSimulacionSchema,
  obtenerSimulacionesDocenteQuerySchema,
} from '../validators/simulacion.validator';

import {
  crearSimulacion,
  editarTituloSimulacion,
  listarSimulacionesDocente,
  obtenerEntregasSimulacion,
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

router.get(
  '/:id/entregas',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEntregasSimulacionSchema),
  obtenerEntregasSimulacion
);

export default router;
