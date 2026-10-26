import { z } from 'zod';

//change to actual data being returned -- add filename for the attachment image
export const StockMovementsDataSchema = z.object({
  id: z.number(),
  delta: z.number(),
  stockLevelAfter: z.number(),
  createdAt: z.coerce.date(), // JSON sends a date string, coerce turns it into a Date
  reason: z.string(),
  userName: z.string().nullable(),
});

export type StockMovement = z.infer<typeof StockMovementsDataSchema>;

// What POST /stockmovements/:id returns after adding / removing stock.
// lowStockEventId is null when the part isn't below its minimum.
export const AdjustStockResultSchema = z.object({
  partId: z.number(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
  lowStockEventId: z.number().nullable(),
});

export type AdjustStockResult = z.infer<typeof AdjustStockResultSchema>;
