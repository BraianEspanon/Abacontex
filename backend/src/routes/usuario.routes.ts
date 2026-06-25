import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { crearUsuario } from '../controllers/usuario.controller';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { crearUsuarioSchema } from '../validators/usuario.validator';

const router = Router();

router.post('/', authenticate, requireRole('ADMIN'), validate(crearUsuarioSchema), crearUsuario);

export default router;