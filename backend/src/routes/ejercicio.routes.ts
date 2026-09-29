import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadDocumento } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  consultarResolucionDocenteSchema,
  crearEjercicioSchema,
  duplicarEjercicioSchema,
  editarEjercicioSchema,
  generarEjercicioSchema,
  obtenerEjercicioPorIdSchema,
  obtenerEjerciciosQuerySchema,
} from '../validators/ejercicio.validator';

import {
  consultarResolucionDocente,
  crearEjercicio,
  digitalizarEjercicio,
  duplicarEjercicio,
  editarEjercicio,
  generarEjercicio,
  obtenerEjercicioPorId,
  obtenerEjercicios,
  obtenerOpcionesGeneracion,
} from '../controllers/ejercicio.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEjerciciosQuerySchema),
  obtenerEjercicios
);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(crearEjercicioSchema),
  crearEjercicio
);

router.get(
  '/generar/opciones',
  authenticate,
  requireRole(ROLES.DOCENTE),
  obtenerOpcionesGeneracion
);

router.post(
  '/digitalizar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  uploadDocumento.single('archivo'),
  digitalizarEjercicio
);

router.post(
  '/generar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(generarEjercicioSchema),
  generarEjercicio
);

router.get(
  '/:id',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEjercicioPorIdSchema),
  obtenerEjercicioPorId
);

router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(editarEjercicioSchema),
  editarEjercicio
);

router.post(
  '/:id/duplicar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(duplicarEjercicioSchema),
  duplicarEjercicio
);

router.get(
  '/:id/resolucion',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(consultarResolucionDocenteSchema),
  consultarResolucionDocente
);

export default router;
