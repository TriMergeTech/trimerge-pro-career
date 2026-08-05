import { Schema, model } from 'mongoose';
import { ApplicationDocument } from './application.types';

const applicationSchema = new Schema<ApplicationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'],
      default: 'PENDING',
    },

    coverLetter: { type: String, trim: true },

    coverLetterFileUrl: { type: String, trim: true },
    coverLetterPublicId: { type: String, trim: true },
    coverLetterOriginalName: { type: String, trim: true },
    coverLetterMimeType: { type: String, trim: true },
    coverLetterSize: { type: Number },
    coverLetterExtension: { type: String, trim: true },
    coverLetterTextExtractedAt: { type: Date },
    coverLetterParsingStatus: {
      type: String,
      enum: ['NOT_PROVIDED', 'SUCCESS', 'FAILED'],
      default: 'NOT_PROVIDED',
    },
    coverLetterParsingError: { type: String, trim: true },

    aiMatchStatus: {
      type: String,
      enum: ['NOT_STARTED', 'PENDING', 'COMPLETED', 'FAILED', 'SKIPPED'],
      default: 'NOT_STARTED',
      index: true,
    },
    aiEvaluationId: { type: Schema.Types.ObjectId, ref: 'AiMatchEvaluation' },
    aiOverallScore: { type: Number, min: 0, max: 100 },
    aiRecommendation: {
      type: String,
      enum: ['STRONG_MATCH', 'GOOD_MATCH', 'PARTIAL_MATCH', 'LOW_MATCH'],
    },
    aiEvaluatedAt: { type: Date },
    aiError: { type: String, trim: true },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ candidateId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, aiOverallScore: -1 });

export const ApplicationModel = model<ApplicationDocument>('Application', applicationSchema);