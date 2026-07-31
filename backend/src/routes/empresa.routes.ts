import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { ROLES } from '../constants/roles';

import {
  actualizarEmpresa,
  agregarParticipantes,
  cambiarRolParticipante,
  crearEmpresa,
  getCandidatos,
  getEmpresaActual,
  modificarRolesEmpresa,
  crearInvitaciones,
  getInvitacionesEnviadas,
} from '../controllers/empresa.controller';

import {
  agregarParticipantesSchema,
  cambiarRolParticipanteSchema,
  crearEmpresaSchema,
  modificarRolesEmpresaSchema,
} from '../validators/empresa.validator';

import { crearInvitacionesSchema } from '../validators/invitacion.validator';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearEmpresaSchema),
  crearEmpresa
);

router.get('/me', authenticate, requireRole(ROLES.ALUMNO), getEmpresaActual);

router.patch(
  '/me',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearEmpresaSchema),
  actualizarEmpresa
);

router.get('/candidatos', authenticate, requireRole(ROLES.ALUMNO), getCandidatos);

router.post(
  '/me/participantes',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(agregarParticipantesSchema),
  agregarParticipantes
);

router.patch(
  '/me/participantes/:idAlumno/rol',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(cambiarRolParticipanteSchema),
  cambiarRolParticipante
);

router.patch(
  '/:idEmpresa/roles',
  authenticate,
  requireRole(ROLES.DOCENTE),
  validate(modificarRolesEmpresaSchema),
  modificarRolesEmpresa
);

/* INVITACIONES A EMPRESA */

router.post(
  '/me/invitaciones',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearInvitacionesSchema),
  crearInvitaciones
);

router.get(
  '/me/invitaciones/enviadas',
  authenticate,
  requireRole('ALUMNO'),
  getInvitacionesEnviadas
);

export default router;
