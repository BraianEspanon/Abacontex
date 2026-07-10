import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerUsuarioActual,
  actualizarUsuarioActual,
  actualizarPassword,
} from '../controllers/usuario.controller';
import { actualizarPasswordSchema } from '../validators/usuario.validator';
import { actualizarUsuarioSchema } from '../validators/alumno.validator';

const router = Router();

router.get('/me', authenticate, obtenerUsuarioActual);
router.patch('/me', authenticate, validate(actualizarUsuarioSchema), actualizarUsuarioActual);
router.patch('/me/password', authenticate, validate(actualizarPasswordSchema), actualizarPassword);

export default router;
