import { Document, Types } from 'mongoose';

export interface CandidateProfile {
  userId: Types.ObjectId;
  headline?: string;
  skills: string[];
  experienceLevel?: string;
  location?: string;
  bio?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  phoneNumber?: string;
  jobTitleOrDesiredRole?: string;
  yearsOfExperience?: string;
  professionalSummary?: string;
}

export interface CandidateProfileDocument extends CandidateProfile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}