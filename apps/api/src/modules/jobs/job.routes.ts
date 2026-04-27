import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import { createJobSchema, updateJobSchema } from './job.schemas';
import {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getEmployerStats,
} from './job.controller';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(createJobSchema),
  createJob
);

router.get('/', requireAuth, listJobs);
router.get('/employer/my-jobs', requireAuth, requireRole('EMPLOYER'), getMyJobs);
router.get('/employer/stats', requireAuth, requireRole('EMPLOYER'), getEmployerStats);
router.get('/:id', requireAuth, getJobById);

router.put(
  '/:id',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateJobSchema),
  updateJob
);

router.delete('/:id', requireAuth, requireRole('EMPLOYER'), deleteJob);

export default router;