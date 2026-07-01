import { Router } from 'express';
import { getCursos } from '../controllers/curso.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getCursos);

export default router;
