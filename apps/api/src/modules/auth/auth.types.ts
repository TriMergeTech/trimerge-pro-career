import { Document, Types } from 'mongoose';

export type OtpCodeType = 'VERIFY_EMAIL' | 'RESET_PASSWORD';

export interface OtpCode {
  userId: Types.ObjectId;
  type: OtpCodeType;
  codeHash: string;
  expiresAt: Date;
  usedAt?: Date;
  attemptCount: number;
}

export interface OtpCodeDocument extends OtpCode, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface RefreshTokenDocument extends RefreshToken, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
