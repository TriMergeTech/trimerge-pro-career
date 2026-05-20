import { Schema, model } from 'mongoose';
import { AiMatchEvaluationDocument } from './ai-match.types';

const scoreBreakdownSchema = new Schema(
  {
    skills: { type: Number, required: true, min: 0, max: 100 },
    experience: { type: Number, required: true, min: 0, max: 100 },
    education: { type: Number, required: true, min: 0, max: 100 },
    seniority: { type: Number, required: true, min: 0, max: 100 },
    locationFit: { type: Number, required: true, min: 0, max: 100 },
    resumeQuality: { type: Number, required: true, min: 0, max: 100 },
    coverLetterAlignment: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const evidenceItemSchema = new Schema(
  {
    criterion: { type: String, required: true, trim: true },
    matchLevel: {
      type: String,
      enum: ['STRONG', 'MODERATE', 'WEAK', 'MISSING'],
      required: true,
    },
    evidence: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ['RESUME', 'COVER_LETTER', 'PROFILE', 'JOB_DESCRIPTION', 'INFERRED'],
      required: true,
    },
  },
  { _id: false }
);

const jobSnapshotSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirements: { type: String, trim: true },
    skills: { type: [String], default: [] },
    location: { type: String, trim: true },
    employmentType: { type: String, trim: true },
    department: { type: String, trim: true },
  },
  { _id: false }
);

const aiMatchEvaluationSchema = new Schema<AiMatchEvaluationDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
      index: true,
    },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },

    overallScore: { type: Number, required: true, min: 0, max: 100 },
    recommendation: {
      type: String,
      enum: ['STRONG_MATCH', 'GOOD_MATCH', 'PARTIAL_MATCH', 'LOW_MATCH'],
      required: true,
      index: true,
    },

    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    confidenceLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      required: true,
      index: true,
    },
    confidenceReason: { type: String, required: true, trim: true },

    scoreBreakdown: { type: scoreBreakdownSchema, required: true },

    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },

    requiredSkillsMatched: { type: [String], default: [] },
    requiredSkillsMissing: { type: [String], default: [] },
    preferredSkillsMatched: { type: [String], default: [] },
    preferredSkillsMissing: { type: [String], default: [] },

    strengths: { type: [String], default: [] },
    concerns: { type: [String], default: [] },

    evidence: { type: [evidenceItemSchema], default: [] },

    recruiterSummary: { type: String, required: true, trim: true },
    detailedRecruiterAnalysis: { type: String, required: true, trim: true },
    candidateMessage: { type: String, required: true, trim: true },

    jobSnapshot: { type: jobSnapshotSchema, required: true },
    resumeTextHash: { type: String, required: true, trim: true, index: true },
    coverLetterHash: { type: String, trim: true, index: true },
    jobContentHash: { type: String, required: true, trim: true, index: true },

    aiModel: { type: String, required: true, trim: true },
    promptVersion: { type: String, required: true, trim: true },

    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

aiMatchEvaluationSchema.index({ jobId: 1, overallScore: -1 });
aiMatchEvaluationSchema.index({ candidateId: 1, createdAt: -1 });
aiMatchEvaluationSchema.index({ jobId: 1, confidenceScore: -1 });
aiMatchEvaluationSchema.index({ jobId: 1, jobContentHash: 1 });

export const AiMatchEvaluationModel = model<AiMatchEvaluationDocument>(
  'AiMatchEvaluation',
  aiMatchEvaluationSchema
);