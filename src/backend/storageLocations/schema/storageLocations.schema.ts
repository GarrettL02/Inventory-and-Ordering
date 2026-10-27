import z from 'zod';

////////////////////////////////////////////////////////
//
// Storage Location Data Schema
// (one row of the stock history list)
// userName is null when the movement has no user (made by the system,
// or the user was deleted) - that's why the query uses a LEFT JOIN.
//
////////////////////////////////////////////////////////
export const StorageLocationDataSchema = z.object({
  id: z.number(),
  name: z.string(),
});

////////////////////////////////////////////////////////
//
// Create Storage Location Request Schema
// (body of POST /storagelocations - just the name)
//
////////////////////////////////////////////////////////
export const CreateStorageLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required')
    .max(255, 'name must be 255 characters or less'),
});

export type CreateStorageLocationDto = z.infer<
  typeof CreateStorageLocationSchema
>;
