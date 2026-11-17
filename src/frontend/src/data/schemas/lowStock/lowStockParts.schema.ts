import { z } from 'zod';

export const LowStockPartsSchema = z.object({
  id: z.number(),
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  triggeredAt: z.string(),
  inCart: z.number(),
});

export type LowStockPart = z.infer<typeof LowStockPartsSchema>;

export const RecentLowStockPartsSchema = z.object({
  name: z.string(),
  description: z.string(),
  triggeredAt: z.string(),
  totalRows: z.number(),
});

export type RecentLowStockPart = z.infer<typeof RecentLowStockPartsSchema>;
