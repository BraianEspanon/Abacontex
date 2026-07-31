import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ROLES } from '../constants/roles';
import { completarRegistroSchema } from '../validators/alumno.validator';
import { validate } from '../middleware/validate.middleware';
import { requireRole } from '../middleware/role.middleware';

import {
  getAlumnoActual,
  getRegistro,
  completarRegistro,
  getInvitacion,
  aceptarInvitacion,
  rechazarInvitacion,
} from '../controllers/alumno.controller';

const router = Router();

router.get('/me', authenticate, requireRole(ROLES.ALUMNO), getAlumnoActual);

// ===== INVITACION =====
router.get('/me/invitacion', authenticate, requireRole(ROLES.ALUMNO), getInvitacion);

router.post(
  '/me/invitacion/:id/aceptar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  aceptarInvitacion
);

router.post(
  '/me/invitacion/:id/rechazar',
  authenticate,
  requireRole(ROLES.ALUMNO),
  rechazarInvitacion
);

// ===== REGISTRO =====
router.get('/me/registro', authenticate, requireRole(ROLES.ALUMNO), getRegistro);

router.patch(
  '/me/registro',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(completarRegistroSchema),
  completarRegistro
);

export default router;
