import { Schema, model } from 'mongoose';
import { ApplicationDocument } from './application.types';

const applicationSchema = new Schema<ApplicationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'],
      default: 'PENDING',
    },
    coverLetter: { type: String, trim: true },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ candidateId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, createdAt: -1 });

export const ApplicationModel = model<ApplicationDocument>('Application', applicationSchema);