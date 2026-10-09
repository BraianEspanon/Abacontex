import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerNotificacionesQuerySchema } from '../validators/notificacion.validator';
import { obtenerNotificaciones } from '../controllers/notificacion.controller';

const router = Router();

router.get('/', authenticate, validate(obtenerNotificacionesQuerySchema), obtenerNotificaciones);

export default router;
