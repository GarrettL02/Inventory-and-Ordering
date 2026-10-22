import { z } from 'zod';

export const LowStockTableRowSchema = z.object({
  lowStockId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  sent: z.number(),
  partId: z.number(),
  name: z.string(),
  description: z.string(),
  comment: z.string().nullable().optional(),
  averagePrice: z.string(),
});

export type LowStockTableRow = z.infer<typeof LowStockTableRowSchema>;
