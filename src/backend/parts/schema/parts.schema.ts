import { z } from 'zod';

////////////////////////////////////////////////////////
//
// Part Details Data Schema
//
////////////////////////////////////////////////////////
export const PartDetailsDataSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  footprint_id: z.number().optional().nullable(),
  name: z.string(),
  description: z.string(),
  comment: z.string(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  averagePrice: z.string(),
  status: z.string(),
  needsReview: z.number(),
  partCondition: z.string(),
  productionRemarks: z.string(),
  createDate: z.date(),
  internalPartNumber: z.string(),
  removals: z.number(),
  lowStock: z.number(),
  metaPart: z.number(),
  partUnit_id: z.number(),
  storageLocation_id: z.number(),
  partURL: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  storageLocationName: z.string(),
  manufacturerName: z.string().nullable().optional(),
  manufacturerPartNumber: z.string().nullable().optional(),
});

export const PartDetailsDataRowArraySchema = z.array(PartDetailsDataSchema);

export type PartDetailsDataRows = z.infer<typeof PartDetailsDataRowArraySchema>;

////////////////////////////////////////////////////////
//
// Part Details Data Schema
//
////////////////////////////////////////////////////////
export const GetAllPartsDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  comment: z.string().nullable().optional(),
  averagePrice: z.string(),
  storageLocation: z.string(),
  stockLevel: z.number(),
});

export const GetAllPartsDataRowArraySchema = z.array(GetAllPartsDataSchema);

export type GetAllPartsDataRows = z.infer<typeof GetAllPartsDataRowArraySchema>;
