import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import { createJobSchema, updateJobSchema, listJobsQuerySchema } from './job.schemas';
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

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Create a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - employmentType
 *               - department
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *               department:
 *                 type: string
 *                 enum: [ENGINEERING, MARKETING, HR, SALES, DESIGN, OPERATIONS]
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               currency:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, DRAFT]
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post(
  '/',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(createJobSchema),
  createJob
);

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: List jobs with filters and pagination
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED, DRAFT]
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [ENGINEERING, MARKETING, HR, SALES, DESIGN, OPERATIONS]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobs listed successfully
 */
router.get(
  '/',
  requireAuth,
  validateRequest(listJobsQuerySchema),
  listJobs
);

/**
 * @swagger
 * /api/v1/jobs/employer/my-jobs:
 *   get:
 *     summary: Get jobs created by the authenticated employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Employer jobs returned successfully
 */
router.get('/employer/my-jobs', requireAuth, requireRole('EMPLOYER'), getMyJobs);

/**
 * @swagger
 * /api/v1/jobs/employer/stats:
 *   get:
 *     summary: Get employer job statistics
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer job stats returned successfully
 */
router.get('/employer/stats', requireAuth, requireRole('EMPLOYER'), getEmployerStats);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job returned successfully
 *       404:
 *         description: Job not found
 */
router.get('/:id', requireAuth, getJobById);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *               department:
 *                 type: string
 *                 enum: [ENGINEERING, MARKETING, HR, SALES, DESIGN, OPERATIONS]
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               currency:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, DRAFT]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put(
  '/:id',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateJobSchema),
  updateJob
);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete('/:id', requireAuth, requireRole('EMPLOYER'), deleteJob);

export default router;