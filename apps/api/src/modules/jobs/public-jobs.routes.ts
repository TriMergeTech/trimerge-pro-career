import { Router } from 'express';
import { validateRequest } from '../../middleware/validate-request';
import { listJobsQuerySchema } from './job.schemas';
import { getPublicJobById, listPublicJobs } from './public-jobs.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/public/jobs:
 *   get:
 *     summary: List public open jobs with filters and pagination
 *     tags: [Public Jobs]
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
 *         description: Public jobs listed successfully
 */
router.get(
  '/',
  validateRequest(listJobsQuerySchema),
  listPublicJobs
);

/**
 * @swagger
 * /api/v1/public/jobs/{id}:
 *   get:
 *     summary: Get public open job by ID
 *     tags: [Public Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Public job returned successfully
 *       404:
 *         description: Job not found
 */
router.get('/:id', getPublicJobById);

export default router;