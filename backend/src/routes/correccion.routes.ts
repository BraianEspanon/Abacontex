import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  entregaIdParamSchema,
  guardarBorradorCorreccionSchema,
  obtenerEjerciciosACorregirQuerySchema,
  obtenerEntregasEjercicioSchema,
  revisarPlantillaSchema,
} from '../validators/correccion.validator';

import {
  actualizarRevisionPlantilla,
  guardarBorradorCorreccion,
  obtenerEjerciciosACorregir,
  obtenerEntregasEjercicio,
  obtenerEspacioTrabajoCorreccion,
  obtenerFiltrosTablero,
} from '../controllers/correccion.controller';

const router = Router();

router.get(
  '/ejercicios',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEjerciciosACorregirQuerySchema),
  obtenerEjerciciosACorregir
);

router.get('/filtros', authenticate, requireRole(ROLES.DOCENTE), obtenerFiltrosTablero);

router.get(
  '/ejercicios/:ejercicioId/entregas',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEntregasEjercicioSchema),
  obtenerEntregasEjercicio
);

router.get(
  '/entregas/:entregaId',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(entregaIdParamSchema),
  obtenerEspacioTrabajoCorreccion
);

router.patch(
  '/entregas/:entregaId/plantillas/:plantillaId',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(revisarPlantillaSchema),
  actualizarRevisionPlantilla
);

router.patch(
  '/entregas/:entregaId/borrador',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(guardarBorradorCorreccionSchema),
  guardarBorradorCorreccion
);

export default router;
