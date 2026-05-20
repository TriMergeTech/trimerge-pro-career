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
  yourRole?: string;
  jobTitle?: string;
  companyOverview?: string;
  benefitsAndOpportunities?: string;
  primaryHiringNeeds?: string[];
  logoUrl?: string;
}

export interface EmployerProfileDocument extends EmployerProfile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}