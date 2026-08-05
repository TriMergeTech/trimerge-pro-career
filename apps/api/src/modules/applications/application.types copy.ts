import { Document, Types } from 'mongoose';

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'HIRED';

export type AiMatchStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export type CoverLetterParsingStatus =
  | 'NOT_PROVIDED'
  | 'SUCCESS'
  | 'FAILED';

export interface Application {
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  status: ApplicationStatus;

  coverLetter?: string;

  coverLetterFileUrl?: string;
  coverLetterPublicId?: string;
  coverLetterOriginalName?: string;
  coverLetterMimeType?: string;
  coverLetterSize?: number;
  coverLetterExtension?: string;
  coverLetterTextExtractedAt?: Date;
  coverLetterParsingStatus?: CoverLetterParsingStatus;
  coverLetterParsingError?: string;

  aiMatchStatus?: AiMatchStatus;
  aiEvaluationId?: Types.ObjectId;
  aiOverallScore?: number;
  aiRecommendation?: 'STRONG_MATCH' | 'GOOD_MATCH' | 'PARTIAL_MATCH' | 'LOW_MATCH';
  aiEvaluatedAt?: Date;
  aiError?: string;
}

export interface ApplicationDocument extends Application, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}