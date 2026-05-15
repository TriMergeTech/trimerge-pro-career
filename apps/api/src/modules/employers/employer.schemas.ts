import { z } from 'zod';

export const createEmployerProfileSchema = z.object({
  companyName: z.string().trim().min(1),
  companyWebsite: z.string().url().optional(),
  companySize: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  location: z.string().trim().optional(),
  about: z.string().trim().optional(),
  contactEmail: z.string().email().trim().toLowerCase().optional(),
  contactPhone: z.string().trim().optional(),
  yourRole: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  companyOverview: z.string().trim().optional(),
  benefitsAndOpportunities: z.string().trim().optional(),
  primaryHiringNeeds: z.string().trim().optional(),
  logoUrl: z.string().url().optional(),
});

export const updateEmployerProfileSchema = z.object({
  companyName: z.string().trim().min(1).optional(),
  companyWebsite: z.string().url().optional(),
  companySize: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  location: z.string().trim().optional(),
  about: z.string().trim().optional(),
  contactEmail: z.string().email().trim().toLowerCase().optional(),
  contactPhone: z.string().trim().optional(),
  yourRole: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  companyOverview: z.string().trim().optional(),
  benefitsAndOpportunities: z.string().trim().optional(),
  primaryHiringNeeds: z.string().trim().optional(),
  logoUrl: z.string().url().optional(),
});

export type CreateEmployerProfileInput = z.infer<typeof createEmployerProfileSchema>;
export type UpdateEmployerProfileInput = z.infer<typeof updateEmployerProfileSchema>;