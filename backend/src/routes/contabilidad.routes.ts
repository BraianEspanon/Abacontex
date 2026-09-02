import { Router } from 'express';
import { ROLES } from '../constants/roles';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

import { obtenerLibroMayor, obtenerEstadoResultados } from '../controllers/contabilidad.controller';

import cuentaRoutes from './cuenta.routes';
import asientoRoutes from './asiento.routes';

const router = Router();

router.use('/cuentas', cuentaRoutes);
router.use('/asientos', asientoRoutes);
router.get('/libro-mayor', authenticate, requireRole(ROLES.ALUMNO), obtenerLibroMayor);
router.get('/estado-resultados', authenticate, requireRole(ROLES.ALUMNO), obtenerEstadoResultados);

export default router;
