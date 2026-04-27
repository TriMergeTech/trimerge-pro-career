import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import {
  createCandidateProfileSchema,
  updateCandidateProfileSchema,
} from './candidate.schemas';
import {
  createCandidateProfile,
  getMyCandidateProfile,
  updateMyCandidateProfile,
  getCandidateProfileById,
} from './candidate.controller';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(createCandidateProfileSchema),
  createCandidateProfile
);

router.get(
  '/me',
  requireAuth,
  requireRole('TALENT'),
  getMyCandidateProfile
);

router.put(
  '/me',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(updateCandidateProfileSchema),
  updateMyCandidateProfile
);

router.get(
  '/:id',
  requireAuth,
  getCandidateProfileById
);

export default router;