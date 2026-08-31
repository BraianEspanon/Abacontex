import { Router } from 'express';

import cuentaRoutes from './cuenta.routes';
import asientoRoutes from './asiento.routes';

const router = Router();

router.use('/cuentas', cuentaRoutes);
router.use('/asientos', asientoRoutes);

export default router;
