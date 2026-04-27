import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(12),
  accountType: z.enum(['EMPLOYER', 'TALENT']),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  avatarUrl: z.string().url().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z.string().min(4).max(10),
  type: z.enum(['VERIFY_EMAIL', 'RESET_PASSWORD']),
});

export const resendOtpSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  type: z.enum(['VERIFY_EMAIL', 'RESET_PASSWORD']),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z.string().min(4).max(10),
  newPassword: z.string().min(12),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;