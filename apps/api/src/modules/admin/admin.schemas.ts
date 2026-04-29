import { z } from 'zod';

export const listAdminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  accountType: z.enum(['EMPLOYER', 'TALENT', 'ADMIN']).optional(),
  status: z.enum(['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED']).optional(),
  search: z.string().trim().optional(),
});

export const updateAdminUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export const listAdminJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']).optional(),
  search: z.string().trim().optional(),
});

export const updateAdminJobStatusSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']),
});

export type ListAdminUsersQuery = z.infer<typeof listAdminUsersQuerySchema>;
export type UpdateAdminUserStatusInput = z.infer<typeof updateAdminUserStatusSchema>;
export type ListAdminJobsQuery = z.infer<typeof listAdminJobsQuerySchema>;
export type UpdateAdminJobStatusInput = z.infer<typeof updateAdminJobStatusSchema>;