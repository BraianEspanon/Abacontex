import { Router } from 'express';
import { getRolesEmpresa } from '../controllers/rol-empresa.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getRolesEmpresa);

export default router;
