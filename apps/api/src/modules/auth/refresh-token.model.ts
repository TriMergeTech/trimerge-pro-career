import { Schema, model, Types } from 'mongoose';
import { RefreshTokenDocument } from './auth.types';

const refreshTokenSchema = new Schema<RefreshTokenDocument>({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
  userAgent: { type: String },
  ipAddress: { type: String },
}, { timestamps: true });

refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

export const RefreshTokenModel = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
