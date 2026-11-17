import z from 'zod';

////////////////////////////////////////////////////////
//
// Part Distributor Event All Data Schema
//
////////////////////////////////////////////////////////
export const PartDistributorsSchema = z.object({
  distributor: z.string(),
  distributorPartNumber: z.string(),
});

export const PartDistributorRowArraySchema = z.array(PartDistributorsSchema);
