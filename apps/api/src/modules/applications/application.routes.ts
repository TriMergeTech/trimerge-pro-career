import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from './application.schemas';
import {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from './application.controller';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(createApplicationSchema),
  createApplication
);

router.get(
  '/my-applications',
  requireAuth,
  requireRole('TALENT'),
  getMyApplications
);

router.get(
  '/job/:jobId',
  requireAuth,
  requireRole('EMPLOYER'),
  getApplicationsForJob
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateApplicationStatusSchema),
  updateApplicationStatus
);

export default router;