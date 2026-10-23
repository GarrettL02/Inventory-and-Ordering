import { z } from 'zod';

////////////////////////////////////////////////////////
//
// Low Stock Event Table Data Schema
// (rows for the low stock table; new-part requests have partId 0)
//
////////////////////////////////////////////////////////
export const LowStockEventTableDataSchema = z.object({
  lowStockId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  quantity: z.number(),
  urgency: z.number(),
  requestedBy: z.string(),
  sent: z.number(),
  partId: z.number(),
  isNewPart: z.number(),
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
  quantity: z.number(),
  urgency: z.number(),
  requestedBy: z.string(),
  triggeredAt: z.date(),
  sent: z.number(),
  ordered: z.number(),
  checked: z.number(),
  newPartName: z.string().nullable().optional(),
  newPartDescription: z.string().nullable().optional(),
  newPartComment: z.string().nullable().optional(),
  newPartURL: z.string().nullable().optional(),
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
export const LowStockEventDataByIdSchema = LowStockEventAllDataSchema;

export const LowStockEventDataByIdRowArraySchema = z.array(
  LowStockEventDataByIdSchema,
);

export type LowStockEventDataByIdRows = z.infer<
  typeof LowStockEventDataByIdRowArraySchema
>;
