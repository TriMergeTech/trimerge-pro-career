import { Document, Types } from 'mongoose';

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'HIRED';

export interface Application {
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  status: ApplicationStatus;
  coverLetter?: string;
}

export interface ApplicationDocument extends Application, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}