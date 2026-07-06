import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { ROLES } from '../constants/roles';

import {
  actualizarEmpresa,
  agregarParticipantes,
  crearEmpresa,
  getCandidatos,
  getEmpresaActual,
} from '../controllers/empresa.controller';

import { agregarParticipantesSchema, crearEmpresaSchema } from '../validators/empresa.validator';

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

export default router;
