import { z } from 'zod';

export const LowStockPartsSchema = z.object({
  id: z.number(),
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  triggeredAt: z.string(),
  sent: z.number(),
  ordered: z.boolean(),
});

export type LowStockPart = z.infer<typeof LowStockPartsSchema>;
