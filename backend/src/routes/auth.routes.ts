import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { syncUser, me } from '../controllers/auth.controller';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.post('/sync-user', authenticate, syncUser);
router.get('/me', authenticate, requireRole('ALUMNO', 'DOCENTE', 'ADMIN'), me);

export default router;
