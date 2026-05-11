# Frontend / Backend Handoff

## Local Backend
- Base URL: `http://localhost:4000`
- Swagger Docs: `http://localhost:4000/api-docs`

## Environments and CORS
The API allows requests from multiple origins configured in `CORS_ORIGIN`. For local development, the `.env.example` shows how to add multiple origins separated by commas. Update `CORS_ORIGIN` in production and development environments to include your frontend URL and any testing URLs (e.g., Render preview, Swagger UI).

## Auth Flow
### Core endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/auth/me`

### Auth header format
Use:
`Authorization: Bearer <accessToken>`

---

## Onboarding Flow

### Candidate
1. `POST /api/v1/onboarding/register`
2. `POST /api/v1/onboarding/verify-email`
3. `POST /api/v1/auth/login`
4. `GET /api/v1/onboarding/status`
5. `POST /api/v1/onboarding/candidate/step-2`
6. `POST /api/v1/onboarding/candidate/step-3`
7. `GET /api/v1/onboarding/status`
8. Upload resume later through `POST /api/v1/resumes/upload` when the user has the file ready

### Resume upload
- The resume upload endpoint stores the Cloudinary URL in the candidate profile.
- It is optional and can happen after onboarding is complete.
- The frontend should send JSON to onboarding step 2, not multipart form data.

### Recruiter
1. `POST /api/v1/onboarding/register`
2. `POST /api/v1/onboarding/verify-email`
3. `POST /api/v1/auth/login`
4. `GET /api/v1/onboarding/status`
5. `POST /api/v1/onboarding/recruiter/step-2`
6. `POST /api/v1/onboarding/recruiter/step-3`
7. `GET /api/v1/onboarding/status`

### Role mapping
- `Candidate` → `TALENT`
- `Recruiter` → `EMPLOYER`

---

## Employers
- `POST /api/v1/employers`
- `GET /api/v1/employers/me`
- `PUT /api/v1/employers/me`

Protected: `EMPLOYER`

---

## Candidates
- `POST /api/v1/candidates`
- `GET /api/v1/candidates/me`
- `PUT /api/v1/candidates/me`
- `GET /api/v1/candidates/:id`

Protected:
- `POST /me /PUT` → `TALENT`
- `GET /:id` → authenticated route

---

## Jobs
- `POST /api/v1/jobs`
- `GET /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `PUT /api/v1/jobs/:id`
- `DELETE /api/v1/jobs/:id`
- `GET /api/v1/jobs/employer/my-jobs`
- `GET /api/v1/jobs/employer/stats`

Protected:
- create/update/delete/my-jobs/stats → `EMPLOYER`
- list/get by id → authenticated

Pagination supported on job listing.

---

## Applications
- `POST /api/v1/applications`
- `GET /api/v1/applications/my-applications`
- `GET /api/v1/applications/job/:jobId`
- `PATCH /api/v1/applications/:id/status`

Protected:
- apply / my-applications → `TALENT`
- job applications / status update → `EMPLOYER`

Pagination supported on application listing endpoints.

---

## Resumes
- `POST /api/v1/resumes/upload`

Protected: `TALENT`

### Upload notes
- Use `multipart/form-data`
- File field name: `resume`
- Allowed file types:
  - PDF
  - DOC
  - DOCX

---

## Bookmarks
- `POST /api/v1/bookmarks`
- `GET /api/v1/bookmarks/my-bookmarks`
- `DELETE /api/v1/bookmarks/:jobId`

Protected: `TALENT`

Pagination supported on bookmark listing.

---

## Admin
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/status`
- `GET /api/v1/admin/jobs`
- `PATCH /api/v1/admin/jobs/:id/status`

Protected: `ADMIN`

Pagination supported on admin list endpoints.

---

## Email Notifications
Implemented:
- verification OTP email
- reset password email
- new application notification to employer
- application status update notification to candidate

Note:
Mailgun sandbox restrictions may block delivery to unapproved addresses in development/testing.