import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { validateRequest } from '../../middleware/validate-request';
import { createBookmarkSchema } from './bookmark.schemas';
import {
  createBookmark,
  getMyBookmarks,
  removeBookmark,
} from './bookmark.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/bookmarks:
 *   post:
 *     summary: Bookmark a job
 *     tags: [Bookmarks]
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
 *     responses:
 *       201:
 *         description: Job bookmarked successfully
 *       404:
 *         description: Job not found
 *       409:
 *         description: Job already bookmarked
 */
router.post(
  '/',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(createBookmarkSchema),
  createBookmark
);

/**
 * @swagger
 * /api/v1/bookmarks/my-bookmarks:
 *   get:
 *     summary: Get bookmarked jobs for the authenticated candidate
 *     tags: [Bookmarks]
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
 *         description: Bookmarks returned successfully
 */
router.get(
  '/my-bookmarks',
  requireAuth,
  requireRole('TALENT'),
  getMyBookmarks
);

/**
 * @swagger
 * /api/v1/bookmarks/{jobId}:
 *   delete:
 *     summary: Remove bookmarked job
 *     tags: [Bookmarks]
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
 *         description: Bookmark removed successfully
 *       404:
 *         description: Bookmark not found
 */
router.delete(
  '/:jobId',
  requireAuth,
  requireRole('TALENT'),
  removeBookmark
);

export default router;