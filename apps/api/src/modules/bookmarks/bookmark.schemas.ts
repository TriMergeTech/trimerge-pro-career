import { z } from 'zod';

export const createBookmarkSchema = z.object({
  jobId: z.string().min(1),
});

export const listBookmarksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type ListBookmarksQuery = z.infer<typeof listBookmarksQuerySchema>;