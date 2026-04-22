import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middleware/validate-request';
import {
	registerSchema,
	verifyOtpSchema,
	resendOtpSchema,
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} from './auth.schemas';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/verify-otp', validateRequest(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', validateRequest(resendOtpSchema), authController.resendOtp);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

export default router;
