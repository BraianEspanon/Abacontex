import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  ejercicioIdParamSchema,
  guardarPlantillaAlumnoSchema,
  obtenerEntregasAlumnoQuerySchema,
} from '../validators/entrega.validator';
import {
  consultarCorreccion,
  consultarResolucion,
  finalizarEntrega,
  guardarPlantilla,
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

router.get('/filtros', authenticate, requireRole(ROLES.ALUMNO), obtenerFiltrosTablero);

router.get(
  '/:ejercicioId',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ejercicioIdParamSchema),
  obtenerDetalleEjercicio
);

router.get(
  '/:ejercicioId/resolucion',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ejercicioIdParamSchema),
  consultarResolucion
);

router.get(
  '/:ejercicioId/correccion',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ejercicioIdParamSchema),
  consultarCorreccion
);

router.patch(
  '/:ejercicioId/plantilla',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(guardarPlantillaAlumnoSchema),
  guardarPlantilla
);

router.post(
  '/:ejercicioId/finalizar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(ejercicioIdParamSchema),
  finalizarEntrega
);

export default router;
