import { Router } from 'express';
import cuentaRoutes from './cuenta.routes';

const router = Router();

router.use('/cuentas', cuentaRoutes);

export default router;
