import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middleware/validate-request';
import { requireAuth } from '../../middleware/auth';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from './auth.schemas';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/verify-otp', validateRequest(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', validateRequest(resendOtpSchema), authController.resendOtp);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);
router.get('/me', requireAuth, authController.me);

export default router;