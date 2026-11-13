import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearSimulacionSchema,
  editarTituloSimulacionSchema,
  obtenerConversacionSimulacionSchema,
  obtenerEntregasSimulacionSchema,
  obtenerResumenSimulacionSchema,
  obtenerSimulacionesAlumnoQuerySchema,
  obtenerSimulacionesDocenteQuerySchema,
  responderDecisionSimulacionSchema,
} from '../validators/simulacion.validator';

import {
  crearSimulacion,
  editarTituloSimulacion,
  listarSimulacionesAlumno,
  listarSimulacionesDocente,
  obtenerConversacionSimulacion,
  obtenerEntregasSimulacion,
  obtenerFiltrosDashboardAlumno,
  obtenerOpcionesCrearSimulacion,
  obtenerResumenSimulacion,
  responderDecisionSimulacion,
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

router.get(
  '/alumno/filtros',
  authenticate,
  requireRole(ROLES.ALUMNO),
  obtenerFiltrosDashboardAlumno
);

router.get(
  '/alumno',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerSimulacionesAlumnoQuerySchema),
  listarSimulacionesAlumno
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

router.get(
  '/conversacion/:id',
  authenticate,
  requireRole(ROLES.DOCENTE, ROLES.ALUMNO),
  validate(obtenerConversacionSimulacionSchema),
  obtenerConversacionSimulacion
);

router.post(
  '/conversacion/:id/responder',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(responderDecisionSimulacionSchema),
  responderDecisionSimulacion
);

router.get(
  '/conversacion/:id/resumen',
  authenticate,
  requireRole(ROLES.DOCENTE, ROLES.ALUMNO),
  validate(obtenerResumenSimulacionSchema),
  obtenerResumenSimulacion
);

export default router;
