import { Router } from 'express';
import { validateRequest } from '../../middleware/validate-request';
import { requireAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/roles';
import {
  onboardingRegisterSchema,
  onboardingVerifyEmailSchema,
  onboardingResendVerificationSchema,
  candidateStep2Schema,
  candidateStep3Schema,
  recruiterStep2Schema,
  recruiterStep3Schema,
} from './onboarding.schemas';
import {
  registerOnboarding,
  verifyOnboardingEmail,
  resendOnboardingVerification,
  getOnboardingStatus,
  saveCandidateStep2,
  saveCandidateStep3,
  saveRecruiterStep2,
  saveRecruiterStep3,
} from './onboarding.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/onboarding/register:
 *   post:
 *     summary: Register a new onboarding user
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - role
 *               - agreeToTerms
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Candidate, Recruiter]
 *               agreeToTerms:
 *                 type: boolean
 *               receiveUpdates:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', validateRequest(onboardingRegisterSchema), registerOnboarding);

/**
 * @swagger
 * /api/v1/onboarding/verify-email:
 *   post:
 *     summary: Verify onboarding email with OTP
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post('/verify-email', validateRequest(onboardingVerifyEmailSchema), verifyOnboardingEmail);

/**
 * @swagger
 * /api/v1/onboarding/resend-verification:
 *   post:
 *     summary: Resend onboarding verification email
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email resent
 */
router.post('/resend-verification', validateRequest(onboardingResendVerificationSchema), resendOnboardingVerification);

/**
 * @swagger
 * /api/v1/onboarding/status:
 *   get:
 *     summary: Get onboarding status for authenticated user
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding status returned successfully
 */
router.get('/status', requireAuth, getOnboardingStatus);

/**
 * @swagger
 * /api/v1/onboarding/candidate/step-2:
 *   post:
 *     summary: Save candidate onboarding step 2
 *     description: Save the candidate profile data for step 2. Resume upload is optional and handled separately through /api/v1/resumes/upload when the user wants to add it.
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - jobTitleOrDesiredRole
 *               - yearsOfExperience
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               location:
 *                 type: string
 *               jobTitleOrDesiredRole:
 *                 type: string
 *               yearsOfExperience:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *                 description: Optional resume URL returned by the resume upload endpoint
 *     responses:
 *       200:
 *         description: Candidate onboarding step 2 saved successfully. Resume upload is optional.
 */
router.post(
  '/candidate/step-2',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(candidateStep2Schema),
  saveCandidateStep2
);

/**
 * @swagger
 * /api/v1/onboarding/candidate/step-3:
 *   post:
 *     summary: Save candidate onboarding step 3
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *               - professionalSummary
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               professionalSummary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate onboarding completed successfully
 */
router.post(
  '/candidate/step-3',
  requireAuth,
  requireRole('TALENT'),
  validateRequest(candidateStep3Schema),
  saveCandidateStep3
);

/**
 * @swagger
 * /api/v1/onboarding/recruiter/step-2:
 *   post:
 *     summary: Save recruiter onboarding step 2
 *     tags: [Onboarding]
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
 *               - industry
 *               - location
 *               - yourRole
 *             properties:
 *               companyName:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               industry:
 *                 type: string
 *               companySize:
 *                 type: string
 *               location:
 *                 type: string
 *               yourRole:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recruiter onboarding step 2 saved successfully
 */
router.post(
  '/recruiter/step-2',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(recruiterStep2Schema),
  saveRecruiterStep2
);

/**
 * @swagger
 * /api/v1/onboarding/recruiter/step-3:
 *   post:
 *     summary: Save recruiter onboarding step 3
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyOverview
 *               - benefitsAndOpportunities
 *               - primaryHiringNeeds
 *             properties:
 *               companyOverview:
 *                 type: string
 *               benefitsAndOpportunities:
 *                 type: string
 *               primaryHiringNeeds:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recruiter onboarding completed successfully
 */
router.post(
  '/recruiter/step-3',
  requireAuth,
  requireRole('EMPLOYER'),
  validateRequest(recruiterStep3Schema),
  saveRecruiterStep3
);

export default router;