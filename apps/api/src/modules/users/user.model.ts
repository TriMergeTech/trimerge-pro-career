import { Schema, model } from 'mongoose';
import { UserDocument } from './user.types';

const profileSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String },
  companyName: { type: String },
  avatarUrl: { type: String },
}, { _id: false });


const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  accountType: { type: String, enum: ['EMPLOYER', 'TALENT'], required: true },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED'], default: 'PENDING_VERIFICATION' },
  profile: { type: profileSchema, required: true },
  lastLoginAt: { type: Date },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

export const UserModel = model<UserDocument>('User', userSchema);
