import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';

import {
  obtenerUsuarioActual,
  actualizarUsuarioActual,
  actualizarPassword,
} from '../controllers/usuario.controller';
import { actualizarUsuarioSchema, actualizarPasswordSchema } from '../validators/usuario.validator';

const router = Router();

router.get('/me', authenticate, obtenerUsuarioActual);
router.patch(
  '/me',
  authenticate,
  upload.single('foto'),
  validate(actualizarUsuarioSchema),
  actualizarUsuarioActual
);
router.patch('/me/password', authenticate, validate(actualizarPasswordSchema), actualizarPassword);

export default router;
