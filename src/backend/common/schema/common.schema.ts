import { z } from 'zod';

////////////////////////////////////////////////////////
//
// Total Row Schema
// (the result of SELECT COUNT(*) AS total)
//
////////////////////////////////////////////////////////
export const TotalRowSchema = z.object({
  total: z.number(),
});

////////////////////////////////////////////////////////
//
// Pagination Query Schema
// (?page=2&limit=15 on list endpoints)
// Missing values fall back to the defaults, anything that
// isn't a whole number >= 1 is rejected.
//
////////////////////////////////////////////////////////
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(15),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
