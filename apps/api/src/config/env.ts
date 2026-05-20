import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_EXPIRES_IN is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required'),

  OTP_EXPIRES_MINUTES: z.string().min(1, 'OTP_EXPIRES_MINUTES is required'),
  BCRYPT_ROUNDS: z.string().min(1, 'BCRYPT_ROUNDS is required'),

  CORS_ORIGIN: z
    .string()
    .min(1, 'CORS_ORIGIN is required')
    .transform((val) => val.split(',').map((origin) => origin.trim())),

  MAILGUN_API_KEY: z.string().min(1, 'MAILGUN_API_KEY is required'),
  MAILGUN_DOMAIN: z.string().min(1, 'MAILGUN_DOMAIN is required'),
  MAILGUN_SENDER: z.string().min(1, 'MAILGUN_SENDER is required'),

  CLOUDINARY_URL: z.string().min(1, 'CLOUDINARY_URL is required'),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  AI_MATCHING_ENABLED: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables. Check your .env file.');
}

export const env = _env.data;
export const allowedOrigins = _env.data.CORS_ORIGIN;