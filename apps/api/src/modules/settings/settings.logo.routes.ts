import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import { AppError } from '../../utils/app-error';
import { uploadCompanyLogo } from './settings.logo.controller';

const router = Router();

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

function sanitizeOriginalName(filename: string) {
  return filename
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.\-_]/g, '');
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.includes(extension);

    if (!isMimeAllowed || !isExtensionAllowed) {
      return cb(new AppError('Only PNG, JPG, JPEG, and WEBP images are allowed', 400));
    }

    file.originalname = sanitizeOriginalName(file.originalname);
    cb(null, true);
  },
});

/**
 * @swagger
 * /api/v1/settings/company-logo:
 *   post:
 *     summary: Upload or update employer company logo
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company logo uploaded successfully
 *       400:
 *         description: Invalid file or missing file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/company-logo',
  requireAuth,
  requireRole('EMPLOYER'),
  (req, res, next) => {
    upload.single('logo')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('Company logo must be 3 MB or smaller', 400));
        }

        return next(new AppError(`Upload error: ${err.message}`, 400));
      }

      if (err) {
        return next(err);
      }

      next();
    });
  },
  uploadCompanyLogo
);

export default router;