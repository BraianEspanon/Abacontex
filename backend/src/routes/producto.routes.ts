import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';

import { ROLES } from '../constants/roles';

import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProducto,
  obtenerProductos,
} from '../controllers/producto.controller';

import {
  actualizarProductoSchema,
  crearProductoSchema,
  eliminarProductoSchema,
  obtenerProductosSchema,
} from '../validators/producto.validator';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(obtenerProductosSchema),
  obtenerProductos
);

router.post(
  '/',
  authenticate,
  requireRole(ROLES.ALUMNO),
  upload.single('foto'),
  validate(crearProductoSchema),
  crearProducto
);

router.get('/:idProducto', authenticate, requireRole(ROLES.ALUMNO), getProducto);

router.patch(
  '/:idProducto',
  authenticate,
  requireRole(ROLES.ALUMNO),
  upload.single('foto'),
  validate(actualizarProductoSchema),
  actualizarProducto
);

router.delete(
  '/:idProducto',
  authenticate,
  requireRole(ROLES.ALUMNO),
  validate(eliminarProductoSchema),
  eliminarProducto
);
export default router;
