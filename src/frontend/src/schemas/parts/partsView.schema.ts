import { z } from 'zod';

export const PartViewSchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number().optional().nullable(),
  storageLocationId: z.number(),
  description: z.string(),
  comment: z.string().optional().nullable(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  averagePrice: z.string(),
  status: z.string().optional().nullable(),
  needsReview: z.number().optional().nullable(),
  partCondition: z.string().optional().nullable(),
  partURL: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  internalPartNumber: z
    .string()
    .nullish()
    .transform((val) => (val == null ? null : val.trim())),
  filename: z.string().optional().nullable(),
  storageLocationName: z.string(),
  manufacturerName: z.string().optional().nullable(),
  manufacturerPartNumber: z.string().optional().nullable(),
});

export type PartView = z.infer<typeof PartViewSchema>;
