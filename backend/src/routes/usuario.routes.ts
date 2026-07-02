import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  crearUsuario,
  obtenerUsuarioActual,
  actualizarUsuarioActual,
  actualizarPassword,
} from '../controllers/usuario.controller';
import { crearUsuarioSchema, actualizarPasswordSchema } from '../validators/usuario.validator';
import { actualizarUsuarioSchema } from '../validators/alumno.validator';

const router = Router();

router.post('/', authenticate, requireRole('ADMIN'), validate(crearUsuarioSchema), crearUsuario);
router.get('/me', authenticate, obtenerUsuarioActual);
router.patch('/me', authenticate, validate(actualizarUsuarioSchema), actualizarUsuarioActual);
router.patch('/me/password', authenticate, validate(actualizarPasswordSchema), actualizarPassword);

export default router;
