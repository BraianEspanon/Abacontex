import { Router } from 'express';

import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  cursoIdParamSchema,
  entregaIdParamSchema,
  finalizarCorreccionSchema,
  guardarBorradorCorreccionSchema,
  guardarComentarioErrorSchema,
  obtenerEjerciciosACorregirQuerySchema,
  obtenerEntregasEjercicioSchema,
  revisarPlantillaSchema,
} from '../validators/correccion.validator';

import {
  actualizarRevisionPlantilla,
  finalizarCorreccion,
  guardarBorradorCorreccion,
  guardarComentarioError,
  obtenerAnalisisErroresCurso,
  obtenerEjerciciosACorregir,
  obtenerEntregasEjercicio,
  obtenerEspacioTrabajoCorreccion,
  obtenerFiltrosTablero,
  sugerirRefuerzoCurso,
  sugerirRetroalimentacionIa,
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

router.patch(
  '/entregas/:entregaId/errores/comentario',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(guardarComentarioErrorSchema),
  guardarComentarioError
);

router.post(
  '/entregas/:entregaId/sugerir-retroalimentacion',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(entregaIdParamSchema),
  sugerirRetroalimentacionIa
);

router.post(
  '/entregas/:entregaId/finalizar',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(finalizarCorreccionSchema),
  finalizarCorreccion
);

router.get(
  '/cursos/:cursoId/analisis-errores',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(cursoIdParamSchema),
  obtenerAnalisisErroresCurso
);

router.post(
  '/cursos/:cursoId/sugerir-refuerzo',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(cursoIdParamSchema),
  sugerirRefuerzoCurso
);

export default router;
