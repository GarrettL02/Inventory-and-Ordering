import { z } from 'zod';

//change to actual data being returned -- add filename for the attachment image
export const StorageLocationDataSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type StorageLocationData = z.infer<typeof StorageLocationDataSchema>;
