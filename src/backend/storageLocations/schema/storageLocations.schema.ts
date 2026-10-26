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
