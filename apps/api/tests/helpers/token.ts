import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

export function signTestToken(payload: {
  userId: string;
  email: string;
  accountType: 'TALENT' | 'EMPLOYER' | 'ADMIN';
}) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as jwt.Secret, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}