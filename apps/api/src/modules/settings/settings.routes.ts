import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate-request';
import { changePassword } from './settings.controller';
import { changePasswordSchema } from './settings.schemas';
import companyLogoRouter from './settings.logo.routes';

const router = Router();

/**
 * @swagger
 * /api/v1/settings/change-password:
 *   patch:
 *     summary: Change password for the authenticated user
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 12
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password input
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/change-password',
  requireAuth,
  validateRequest(changePasswordSchema),
  changePassword
);

router.use('/', companyLogoRouter);

export default router;