# Backend QA Checklist

## Auth
- [x] POST /api/v1/auth/register
- [x] POST /api/v1/auth/verify-otp
- [x] POST /api/v1/auth/resend-otp
- [x] POST /api/v1/auth/login
- [x] POST /api/v1/auth/forgot-password
- [x] POST /api/v1/auth/reset-password
- [x] POST /api/v1/auth/refresh-token
- [x] GET /api/v1/auth/me

## Onboarding
- [x] POST /api/v1/onboarding/register (Candidate)
- [x] POST /api/v1/onboarding/verify-email (Candidate)
- [x] GET /api/v1/onboarding/status (Candidate)
- [x] POST /api/v1/onboarding/candidate/step-2
- [x] POST /api/v1/onboarding/candidate/step-3
- [x] POST /api/v1/onboarding/register (Recruiter)
- [x] POST /api/v1/onboarding/verify-email (Recruiter)
- [x] GET /api/v1/onboarding/status (Recruiter)
- [x] POST /api/v1/onboarding/recruiter/step-2
- [x] POST /api/v1/onboarding/recruiter/step-3

## Employers
- [x] POST /api/v1/employers
- [x] GET /api/v1/employers/me
- [x] PUT /api/v1/employers/me

## Candidates
- [x] POST /api/v1/candidates
- [x] GET /api/v1/candidates/me
- [x] PUT /api/v1/candidates/me
- [x] GET /api/v1/candidates/:id

## Jobs
- [x] POST /api/v1/jobs
- [x] GET /api/v1/jobs
- [x] GET /api/v1/jobs/:id
- [x] PUT /api/v1/jobs/:id
- [x] DELETE /api/v1/jobs/:id
- [x] GET /api/v1/jobs/employer/my-jobs
- [x] GET /api/v1/jobs/employer/stats

## Applications
- [x] POST /api/v1/applications
- [x] GET /api/v1/applications/my-applications
- [x] GET /api/v1/applications/job/:jobId
- [x] PATCH /api/v1/applications/:id/status

## Resumes
- [x] POST /api/v1/resumes/upload

## Bookmarks
- [x] POST /api/v1/bookmarks
- [x] GET /api/v1/bookmarks/my-bookmarks
- [x] DELETE /api/v1/bookmarks/:jobId

## Admin
- [x] GET /api/v1/admin/users
- [x] PATCH /api/v1/admin/users/:id/status
- [x] GET /api/v1/admin/jobs
- [ ] PATCH /api/v1/admin/jobs/:id/status with real job record

## Notes
- OTP/auth email sending was validated, but some onboarding registration attempts hit Mailgun sandbox restrictions for new email addresses.
- Candidate and Recruiter onboarding flows were both manually validated through step completion and onboarding status updates.
- Admin job status update endpoint is implemented, but final manual verification with a real job record in the current environment is still pending.