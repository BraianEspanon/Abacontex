import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { uploadDocumento } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearEjercicioSchema,
  editarEjercicioSchema,
  generarEjercicioSchema,
  obtenerEjercicioPorIdSchema,
  obtenerEjerciciosQuerySchema,
} from '../validators/ejercicio.validator';

import {
  crearEjercicio,
  digitalizarEjercicio,
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

export default router;
