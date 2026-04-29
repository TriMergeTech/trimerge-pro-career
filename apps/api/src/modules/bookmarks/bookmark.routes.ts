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

router.post(
  '/',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(createBookmarkSchema),
  createBookmark
);

router.get(
  '/my-bookmarks',
  requireAuth,
  requireRole('TALENT'),
  getMyBookmarks
);

router.delete(
  '/:jobId',
  requireAuth,
  requireRole('TALENT'),
  removeBookmark
);

export default router;