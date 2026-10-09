import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

import {
  obtenerNotificacionesQuerySchema,
  marcarNotificacionLeidaSchema,
} from '../validators/notificacion.validator';
import {
  obtenerNotificaciones,
  obtenerContadorNoLeidas,
  marcarNotificacionComoLeida,
} from '../controllers/notificacion.controller';

const router = Router();

router.get('/', authenticate, validate(obtenerNotificacionesQuerySchema), obtenerNotificaciones);
router.get('/contador', authenticate, obtenerContadorNoLeidas);
router.patch(
  '/:id/leida',
  authenticate,
  validate(marcarNotificacionLeidaSchema),
  marcarNotificacionComoLeida
);

export default router;
