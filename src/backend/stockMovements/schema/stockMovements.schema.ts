import { z } from 'zod';
import { PaginationQuerySchema } from '../../common/schema/common.schema';

////////////////////////////////////////////////////////
//
// Stock Movement Data Schema
// (one row of the stock history list)
// userName is null when the movement has no user (made by the system,
// or the user was deleted) - that's why the query uses a LEFT JOIN.
//
////////////////////////////////////////////////////////
export const StockMovementDataSchema = z.object({
  id: z.number(),
  delta: z.number(),
  stockLevelAfter: z.number(),
  reason: z.string(),
  createdAt: z.date(),
  userName: z.string().nullable(),
});

export const StockMovementDataRowArraySchema = z.array(StockMovementDataSchema);

export type StockMovementDataRows = z.infer<
  typeof StockMovementDataRowArraySchema
>;

////////////////////////////////////////////////////////
//
// Stock Movements Query Schema
// (?partId=12&page=1&limit=15 on GET /stock-movements)
// partId is optional: leave it out to get movements for every part.
//
////////////////////////////////////////////////////////
export const StockMovementsQuerySchema = PaginationQuerySchema.extend({
  partId: z.coerce.number().int().min(1).optional(),
});

////////////////////////////////////////////////////////
//
// Record Stock Movement Input
// (what other services pass to StockMovementsService.record())
//
////////////////////////////////////////////////////////
export type RecordStockMovementInput = {
  partId: number;
  delta: number; // negative = parts used
  stockLevelAfter: number;
  reason: string;
  userId: number | null;
};

////////////////////////////////////////////////////////
//
// Adjust Stock Request Schema
// delta is how much the stock changes by (positive = add, negative = parts used)
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
