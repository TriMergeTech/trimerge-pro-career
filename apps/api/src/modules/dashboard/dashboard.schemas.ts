import { z } from 'zod';

export const employerApplicantsQuerySchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED']).optional(),
  jobId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type EmployerApplicantsQueryInput = z.infer<typeof employerApplicantsQuerySchema>;