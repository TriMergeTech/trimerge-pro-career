import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';
import onboardingRouter from '../modules/onboarding/onboarding.routes';
import employerRouter from '../modules/employers/employer.routes';
import candidateRouter from '../modules/candidates/candidate.routes';
import jobRouter from '../modules/jobs/job.routes';
import applicationRouter from '../modules/applications/application.routes';
import resumeRouter from '../modules/resumes/resume.routes';
import bookmarkRouter from '../modules/bookmarks/bookmark.routes';
import adminRouter from '../modules/admin/admin.routes';
import dashboardRouter from '../modules/dashboard/dashboard.routes';
import settingsRouter from '../modules/settings/settings.routes';
import publicJobsRouter from '../modules/jobs/public-jobs.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

router.use('/api/v1/auth', authRouter);
router.use('/api/v1/onboarding', onboardingRouter);
router.use('/api/v1/employers', employerRouter);
router.use('/api/v1/candidates', candidateRouter);
router.use('/api/v1/jobs', jobRouter);
router.use('/api/v1/applications', applicationRouter);
router.use('/api/v1/resumes', resumeRouter);
router.use('/api/v1/bookmarks', bookmarkRouter);
router.use('/api/v1/admin', adminRouter);
router.use('/api/v1/dashboard', dashboardRouter);
router.use('/api/v1/settings', settingsRouter);
router.use('/api/v1/public/jobs', publicJobsRouter);

export default router;