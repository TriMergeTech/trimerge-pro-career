import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { AppError } from '../../utils/app-error';
import { uploadResume } from './resume.controller';

const router = Router();

const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new AppError('Only PDF, DOC, and DOCX files are allowed', 400));
    }
    cb(null, true);
  },
});

/**
 * @swagger
 * /api/v1/resumes/upload:
 *   post:
 *     summary: Upload candidate resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Invalid file or missing file
 *       403:
 *         description: Forbidden
 */
router.post(
  '/upload',
  requireAuth,
  requireRole('TALENT'),
  upload.single('resume'),
  uploadResume
);

export default router;