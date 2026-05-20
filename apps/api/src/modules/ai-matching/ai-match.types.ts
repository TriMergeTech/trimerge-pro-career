import { Document, Types } from 'mongoose';

export type AiRecommendation =
  | 'STRONG_MATCH'
  | 'GOOD_MATCH'
  | 'PARTIAL_MATCH'
  | 'LOW_MATCH';

export type AiConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type EvidenceSource =
  | 'RESUME'
  | 'COVER_LETTER'
  | 'PROFILE'
  | 'JOB_DESCRIPTION'
  | 'INFERRED';

export type EvidenceMatchLevel =
  | 'STRONG'
  | 'MODERATE'
  | 'WEAK'
  | 'MISSING';

export interface AiScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  seniority: number;
  locationFit: number;
  resumeQuality: number;
  coverLetterAlignment: number;
}

export interface AiEvidenceItem {
  criterion: string;
  matchLevel: EvidenceMatchLevel;
  evidence: string;
  source: EvidenceSource;
}

export interface AiJobSnapshot {
  title: string;
  description: string;
  requirements?: string;
  skills: string[];
  location?: string;
  employmentType?: string;
  department?: string;
}

export interface AiMatchEvaluation {
  applicationId: Types.ObjectId;
  candidateId: Types.ObjectId;
  jobId: Types.ObjectId;

  overallScore: number;
  recommendation: AiRecommendation;

  confidenceScore: number;
  confidenceLevel: AiConfidenceLevel;
  confidenceReason: string;

  scoreBreakdown: AiScoreBreakdown;

  matchedSkills: string[];
  missingSkills: string[];

  requiredSkillsMatched: string[];
  requiredSkillsMissing: string[];
  preferredSkillsMatched: string[];
  preferredSkillsMissing: string[];

  strengths: string[];
  concerns: string[];

  evidence: AiEvidenceItem[];

  recruiterSummary: string;
  detailedRecruiterAnalysis: string;
  candidateMessage: string;

  jobSnapshot: AiJobSnapshot;
  resumeTextHash: string;
  coverLetterHash?: string;
  jobContentHash: string;

  aiModel: string;
  promptVersion: string;

  rawResponse?: unknown;
}

export interface AiMatchEvaluationDocument extends AiMatchEvaluation, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}