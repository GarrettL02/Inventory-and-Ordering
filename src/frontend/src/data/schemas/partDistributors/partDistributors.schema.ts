import { z } from 'zod';

//change to actual data being returned -- add filename for the attachment image
export const PartDistributorDataSchema = z.object({
  id: z.number(),
  partId: z.number(),
  distributor: z.string().min(2).max(100),
  distributorPartNumber: z.string().min(1).max(255),
  productURL: z.string().url().max(2048),
});

export const PartDistributorDataArraySchema = z.array(
  PartDistributorDataSchema,
);
