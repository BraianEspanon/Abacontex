import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';

import { ROLES } from '../constants/roles';

import { crearProducto } from '../controllers/producto.controller';

import { crearProductoSchema } from '../validators/producto.validator';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(crearProductoSchema),
  crearProducto
);

export default router;
