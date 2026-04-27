import { Schema, model } from 'mongoose';
import { EmployerProfileDocument } from './employer.types';

const employerProfileSchema = new Schema<EmployerProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    companyWebsite: { type: String, trim: true },
    companySize: { type: String, trim: true },
    industry: { type: String, trim: true },
    location: { type: String, trim: true },
    about: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

employerProfileSchema.index({ userId: 1 }, { unique: true });

export const EmployerProfileModel = model<EmployerProfileDocument>('EmployerProfile', employerProfileSchema);