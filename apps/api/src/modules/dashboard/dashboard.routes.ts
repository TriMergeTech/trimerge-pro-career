import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import {
  getCandidateDashboardSummary,
  getEmployerApplicants,
  getEmployerCandidateMatches,
  getEmployerDashboardSummary,
  getEmployerRecentApplications,
} from './dashboard.controller';
import { employerApplicantsQuerySchema } from './dashboard.schemas';

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/candidate/summary:
 *   get:
 *     summary: Get candidate dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate dashboard summary returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/candidate/summary',
  requireAuth,
  requireRole('TALENT'),
  getCandidateDashboardSummary
);

/**
 * @swagger
 * /api/v1/dashboard/employer/summary:
 *   get:
 *     summary: Get employer dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer dashboard summary returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/employer/summary',
  requireAuth,
  requireRole('EMPLOYER'),
  getEmployerDashboardSummary
);

/**
 * @swagger
 * /api/v1/dashboard/employer/recent-applications:
 *   get:
 *     summary: Get employer recent applications across all jobs
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer recent applications returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/employer/recent-applications',
  requireAuth,
  requireRole('EMPLOYER'),
  getEmployerRecentApplications
);

/**
 * @swagger
 * /api/v1/dashboard/employer/applicants:
 *   get:
 *     summary: Get employer applicants with optional filters
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED]
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employer applicants returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/employer/applicants',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(employerApplicantsQuerySchema),
  getEmployerApplicants
);

/**
 * @swagger
 * /api/v1/dashboard/employer/job/{jobId}/candidate-matches:
 *   get:
 *     summary: Get candidate matches for a specific employer job
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Candidate matches returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 */
router.get(
  '/employer/job/:jobId/candidate-matches',
  requireAuth,
  requireRole('EMPLOYER'),
  getEmployerCandidateMatches
);

export default router;