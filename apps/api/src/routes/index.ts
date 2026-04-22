import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

router.use('/api/v1/auth', authRouter);

export default router;
