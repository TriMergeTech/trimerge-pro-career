import { Schema, model } from 'mongoose';
import { OtpCodeDocument } from './auth.types';

const otpCodeSchema = new Schema<OtpCodeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['VERIFY_EMAIL', 'RESET_PASSWORD'], required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    attemptCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpCodeSchema.index({ userId: 1, type: 1 });
otpCodeSchema.index({ expiresAt: 1 });

export const OtpCodeModel = model<OtpCodeDocument>('OtpCode', otpCodeSchema);