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

/**
 * @swagger
 * /api/v1/employers:
 *   post:
 *     summary: Create employer profile
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *             properties:
 *               companyName:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               companySize:
 *                 type: string
 *               industry:
 *                 type: string
 *               location:
 *                 type: string
 *               about:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employer profile created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(createEmployerProfileSchema),
  createEmployerProfile
);

/**
 * @swagger
 * /api/v1/employers/me:
 *   get:
 *     summary: Get current employer profile
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employer profile returned successfully
 *       404:
 *         description: Employer profile not found
 */
router.get(
  '/me',
  requireAuth,
  requireRole('EMPLOYER'),
  getMyEmployerProfile
);

/**
 * @swagger
 * /api/v1/employers/me:
 *   put:
 *     summary: Update current employer profile
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               companySize:
 *                 type: string
 *               industry:
 *                 type: string
 *               location:
 *                 type: string
 *               about:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employer profile updated successfully
 *       404:
 *         description: Employer profile not found
 */
router.put(
  '/me',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(updateEmployerProfileSchema),
  updateMyEmployerProfile
);

export default router;