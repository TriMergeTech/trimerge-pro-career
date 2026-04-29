import { Document, Types } from 'mongoose';

export type AccountType = 'EMPLOYER' | 'TALENT';
export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  avatarUrl?: string;
}

export interface User {
  email: string;
  passwordHash: string;
  accountType: AccountType;
  isVerified: boolean;
  status: UserStatus;
  profile: UserProfile;
  lastLoginAt?: Date;
  agreedToTermsAt?: Date;
  receiveUpdates?: boolean;
  onboardingStep?: number;
  onboardingCompleted?: boolean;
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}