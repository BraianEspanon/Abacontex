import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  actualizarCursosDocenteSchema,
  crearDocenteSchema,
  obtenerAlumnosSchema,
  obtenerEmpresaSchema,
  obtenerEmpresasSchema,
} from '../validators/docente.validator';
import {
  crearDocente,
  obtenerDocenteActual,
  obtenerDashboardDocente,
  obtenerCursosDocente,
  obtenerEmpresasDocente,
  obtenerDetalleEmpresaDocente,
  obtenerAlumnos,
  actualizarCursosDocenteActual,
} from '../controllers/docente.controller';
import { ROLES } from '../constants/roles';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN),
  validate(crearDocenteSchema),
  crearDocente
);
router.get('/me', authenticate, requireRole(ROLES.DOCENTE), obtenerDocenteActual);
router.patch(
  '/me/cursos',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(actualizarCursosDocenteSchema),
  actualizarCursosDocenteActual
);
router.get('/me/dashboard', authenticate, requireRole(ROLES.DOCENTE), obtenerDashboardDocente);
router.get('/me/cursos', authenticate, requireRole(ROLES.DOCENTE), obtenerCursosDocente);
router.get(
  '/me/empresas',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEmpresasSchema),
  obtenerEmpresasDocente
);
router.get(
  '/me/empresas/:empresaId',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerEmpresaSchema),
  obtenerDetalleEmpresaDocente
);
router.get(
  '/me/alumnos',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(obtenerAlumnosSchema),
  obtenerAlumnos
);

export default router;
