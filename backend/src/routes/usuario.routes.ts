import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearUsuario, actualizarPassword } from '../controllers/usuario.controller';
import { crearUsuarioSchema, actualizarPasswordSchema } from '../validators/usuario.validator';

const router = Router();

router.post('/', authenticate, requireRole('ADMIN'), validate(crearUsuarioSchema), crearUsuario);
router.patch('/me/password', authenticate, validate(actualizarPasswordSchema), actualizarPassword);

export default router;
