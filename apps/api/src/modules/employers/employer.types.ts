import { Document, Types } from 'mongoose';

export interface EmployerProfile {
  userId: Types.ObjectId;
  companyName: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  about?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface EmployerProfileDocument extends EmployerProfile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}