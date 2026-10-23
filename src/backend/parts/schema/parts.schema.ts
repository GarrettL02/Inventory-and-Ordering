import { z } from 'zod';
import { PaginationQuerySchema } from '../../common/schema/common.schema';

////////////////////////////////////////////////////////
//
// Part Details Data Schema
//
////////////////////////////////////////////////////////
export const PartDetailsDataSchema = z.object({
  id: z.number(),
  categoryId: z.number().nullable().optional(),
  storageLocationId: z.number().nullable(),
  name: z.string(),
  description: z.string(),
  comment: z.string().nullable().optional(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  averagePrice: z.string(),
  status: z.string().nullable().optional(),
  partCondition: z.string().nullable().optional(),
  createdAt: z.date(),
  internalPartNumber: z.string().nullable().optional(),
  partURL: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  storageLocationName: z.string().nullable(),
  manufacturerName: z.string().nullable().optional(),
  manufacturerPartNumber: z.string().nullable().optional(),
});

export const PartDetailsDataRowArraySchema = z.array(PartDetailsDataSchema);

export type PartDetailsDataRows = z.infer<typeof PartDetailsDataRowArraySchema>;

////////////////////////////////////////////////////////
//
// Get All Parts Data Schema
//
////////////////////////////////////////////////////////
export const GetAllPartsDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  comment: z.string().nullable().optional(),
  averagePrice: z.string(),
  storageLocation: z.string().nullable(),
  stockLevel: z.number(),
});

export const GetAllPartsDataRowArraySchema = z.array(GetAllPartsDataSchema);

export type GetAllPartsDataRows = z.infer<typeof GetAllPartsDataRowArraySchema>;

////////////////////////////////////////////////////////
//
// Adjust Stock Request Schema
// delta is how much the stock changes by (negative = parts used)
//
////////////////////////////////////////////////////////
export const AdjustStockSchema = z.object({
  delta: z
    .number()
    .int()
    .refine((value) => value !== 0, 'delta cannot be 0'),
  reason: z.string().trim().min(1).max(64).default('manual'),
});

export type AdjustStockDto = z.infer<typeof AdjustStockSchema>;

////////////////////////////////////////////////////////
//
// Part Stock Row Schema
// (the row adjustStock() reads and locks before changing stock)
//
////////////////////////////////////////////////////////
export const PartStockRowSchema = z.object({
  id: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
});

export const PartStockRowArraySchema = z.array(PartStockRowSchema);

////////////////////////////////////////////////////////
//
// Parts Query Schema
// (?page=1&limit=15&search=resistor on GET /parts)
//
////////////////////////////////////////////////////////
export const PartsQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
});

////////////////////////////////////////////////////////
//
// Adjust Stock Result Schema
// (what adjustStock() returns; lowStockEventId is null when the part
// isn't below its minimum)
//
////////////////////////////////////////////////////////
export const AdjustStockResultSchema = z.object({
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  lowStockEventId: z.number().nullable(),
});

export type AdjustStockResult = z.infer<typeof AdjustStockResultSchema>;
