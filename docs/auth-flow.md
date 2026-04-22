# Auth Module Overview

## Stack
- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- JWT
- bcryptjs
- Mailgun (integration started, currently blocked by Mailgun `Forbidden` response)

## Completed Backend Flows
- Registration for employer and talent users
- OTP verification
- Resend OTP
- Login
- Forgot password
- Reset password

## Main Models
### User
Stores:
- email
- passwordHash
- accountType
- isVerified
- status
- profile
- lastLoginAt

### OtpCode
Stores:
- userId
- type (`VERIFY_EMAIL` or `RESET_PASSWORD`)
- codeHash
- expiresAt
- usedAt
- attemptCount

### RefreshToken
Stores:
- userId
- tokenHash
- expiresAt
- revokedAt
- userAgent
- ipAddress

## Endpoints

### POST /api/v1/auth/register
Registers a new user and creates a verification OTP.

Request body:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "accountType": "TALENT",
  "firstName": "John",
  "lastName": "Doe"
}
Success response:
{
  "message": "Registration successful. Please verify your email with the OTP sent."
}