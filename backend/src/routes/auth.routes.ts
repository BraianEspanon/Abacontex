import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { syncUser } from '../controllers/auth.controller';

const router = Router();

router.post('/sync-user', authenticate, syncUser);

export default router;
