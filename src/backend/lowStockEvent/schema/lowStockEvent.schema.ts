import { z } from 'zod';

////////////////////////////////////////////////////////
//
// Low Stock Event Table Data Schema
//
////////////////////////////////////////////////////////
export const LowStockEventTableDataSchema = z.object({
  lowStockId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  sent: z.number(),
  partId: z.number(),
  name: z.string(),
  description: z.string(),
  comment: z.string().nullable().optional(),
  averagePrice: z.string(),
  partURL: z.string().nullable().optional(),
});

export const LowStockEventTableDataRowArraySchema = z.array(
  LowStockEventTableDataSchema,
);

export type LowStockEventTableDataRows = z.infer<
  typeof LowStockEventTableDataRowArraySchema
>;

////////////////////////////////////////////////////////
//
// Low Stock Event All Data Schema
//
////////////////////////////////////////////////////////
export const LowStockEventAllDataSchema = z.object({
  id: z.number(),
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  triggeredAt: z.date(),
  sent: z.number(),
  ordered: z.number(),
  checked: z.number(),
});

export const LowStockEventAllDataRowArraySchema = z.array(
  LowStockEventAllDataSchema,
);

export type LowStockEventAllDataRows = z.infer<
  typeof LowStockEventAllDataRowArraySchema
>;

////////////////////////////////////////////////////////
//
// Low Stock Event Data By ID Schema
//
////////////////////////////////////////////////////////
export const LowStockEventDataByIdSchema = z.object({
  id: z.number(),
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  triggeredAt: z.date(),
  sent: z.number(),
  ordered: z.number(),
  checked: z.number(),
});

export const LowStockEventDataByIdRowArraySchema = z.array(
  LowStockEventAllDataSchema,
);

export type LowStockEventDataByIdRows = z.infer<
  typeof LowStockEventDataByIdRowArraySchema
>;
