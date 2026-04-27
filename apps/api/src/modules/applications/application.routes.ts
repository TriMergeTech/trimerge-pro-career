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

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Apply to a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created successfully
 *       409:
 *         description: Candidate already applied to this job
 */
router.post(
  '/',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(createApplicationSchema),
  createApplication
);

/**
 * @swagger
 * /api/v1/applications/my-applications:
 *   get:
 *     summary: Get applications of the authenticated candidate
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate applications returned successfully
 */
router.get(
  '/my-applications',
  requireAuth,
  requireRole('TALENT'),
  getMyApplications
);

/**
 * @swagger
 * /api/v1/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a specific job
 *     tags: [Applications]
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
 *         description: Applications for job returned successfully
 *       404:
 *         description: Job not found
 */
router.get(
  '/job/:jobId',
  requireAuth,
  requireRole('EMPLOYER'),
  getApplicationsForJob
);

/**
 * @swagger
 * /api/v1/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       404:
 *         description: Application not found
 */
router.patch(
  '/:id/status',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateApplicationStatusSchema),
  updateApplicationStatus
);

export default router;