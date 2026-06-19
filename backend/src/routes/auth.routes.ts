import { Router } from 'express';

import { me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { syncUser } from '../controllers/auth.controller';

const router = Router();

router.get('/me', authenticate, me);
router.post('/sync-user', authenticate, syncUser);

export default router;
