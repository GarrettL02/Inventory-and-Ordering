import { z } from 'zod';

//change to actual data being returned -- add filename for the attachment image
export const PartTableDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  comment: z.string().optional().nullable(),
  averagePrice: z.string(),
  storageLocation: z.string().optional().nullable(),
  stockLevel: z.number(),
  minStockLevel: z.number(),
});

export type Part = z.infer<typeof PartTableDataSchema>;
