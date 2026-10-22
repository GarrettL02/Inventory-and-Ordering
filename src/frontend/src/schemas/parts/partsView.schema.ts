import { z } from 'zod';

export const PartViewSchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number().optional().nullable(),
  footprint_id: z.string().optional().nullable(),
  description: z.string(),
  comment: z.string().optional().nullable(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  averagePrice: z.string(),
  status: z.string().optional().nullable(),
  needsReview: z.number().optional().nullable(),
  partCondition: z.string().optional().nullable(),
  partURL: z.string().optional().nullable(),
  createdDate: z.string().optional().nullable(),
  internalPartNumber: z
    .any()
    .transform((val) => String(val).trim())
    .optional()
    .nullable(),
  removals: z.number(),
  lowStock: z.number(),
  metaPart: z.number(),
  partUnit_id: z.number(),
  storageLocation_id: z.number(),
  storageLocationName: z.string(),
  manufacturerName: z.string().optional().nullable(),
  manufacturerPartNumber: z.string().optional().nullable(),
});

export type PartView = z.infer<typeof PartViewSchema>;
