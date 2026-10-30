import { Router } from 'express';
import { getCursos, getMisCursos } from '../controllers/curso.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, getMisCursos);
router.get('/', authenticate, getCursos);

export default router;
