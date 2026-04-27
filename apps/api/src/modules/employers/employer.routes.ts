import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import {
  createEmployerProfileSchema,
  updateEmployerProfileSchema,
} from './employer.schemas';
import {
  createEmployerProfile,
  getMyEmployerProfile,
  updateMyEmployerProfile,
} from './employer.controller';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(createEmployerProfileSchema),
  createEmployerProfile
);

router.get(
  '/me',
  requireAuth,
  requireRole('EMPLOYER'),
  getMyEmployerProfile
);

router.put(
  '/me',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateEmployerProfileSchema),
  updateMyEmployerProfile
);

export default router;