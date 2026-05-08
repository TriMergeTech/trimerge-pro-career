import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import {
  listAdminJobsQuerySchema,
  listAdminUsersQuerySchema,
  updateAdminJobStatusSchema,
  updateAdminUserStatusSchema,
} from './admin.schemas';
import {
  deleteAdminUser,
  listAdminJobs,
  listAdminUsers,
  updateAdminJobStatus,
  updateAdminUserStatus,
} from './admin.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: List users for admin moderation
 *     tags: [Admin]
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
 *         name: accountType
 *         schema:
 *           type: string
 *           enum: [EMPLOYER, TALENT, ADMIN]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING_VERIFICATION, ACTIVE, SUSPENDED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users returned successfully
 */
router.get(
  '/users',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(listAdminUsersQuerySchema),
  listAdminUsers
);

/**
 * @swagger
 * /api/v1/admin/users/{id}/status:
 *   patch:
 *     summary: Update user status for admin moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *                 enum: [ACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
router.patch(
  '/users/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(updateAdminUserStatusSchema),
  updateAdminUserStatus
);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user and related testing data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin accounts cannot be deleted through this endpoint
 *       404:
 *         description: User not found
 */
router.delete(
  '/users/:id',
  requireAuth,
  requireRole('ADMIN'),
  deleteAdminUser
);

/**
 * @swagger
 * /api/v1/admin/jobs:
 *   get:
 *     summary: List jobs for admin moderation
 *     tags: [Admin]
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobs returned successfully
 */
router.get(
  '/jobs',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(listAdminJobsQuerySchema),
  listAdminJobs
);

/**
 * @swagger
 * /api/v1/admin/jobs/{id}/status:
 *   patch:
 *     summary: Update job status for admin moderation
 *     tags: [Admin]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, DRAFT]
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *       404:
 *         description: Job not found
 */
router.patch(
  '/jobs/:id/status',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(updateAdminJobStatusSchema),
  updateAdminJobStatus
);

export default router;