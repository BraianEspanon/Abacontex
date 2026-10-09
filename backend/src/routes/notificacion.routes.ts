import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

import { obtenerNotificacionesQuerySchema } from '../validators/notificacion.validator';
import {
  obtenerNotificaciones,
  obtenerContadorNoLeidas,
} from '../controllers/notificacion.controller';

const router = Router();

router.get('/', authenticate, validate(obtenerNotificacionesQuerySchema), obtenerNotificaciones);
router.get('/contador', authenticate, obtenerContadorNoLeidas);

export default router;
