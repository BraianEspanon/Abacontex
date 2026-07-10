import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { crearDocenteSchema } from '../validators/docente.validator';
import { crearDocente, obtenerDocenteActual } from '../controllers/docente.controller';

const router = Router();

router.post('/', authenticate, requireRole('ADMIN'), validate(crearDocenteSchema), crearDocente);
router.get('/me', authenticate, requireRole('DOCENTE'), obtenerDocenteActual);

export default router;
