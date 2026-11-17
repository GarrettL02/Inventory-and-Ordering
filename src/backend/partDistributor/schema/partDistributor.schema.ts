import z from 'zod';
import { DISTRIBUTORS } from '../../common/schema/distributor.schema';

////////////////////////////////////////////////////////
//
// Part Distributor Event All Data Schema
//
////////////////////////////////////////////////////////
export const PartDistributorsSchema = z.object({
  id: z.number(),
  partId: z.number(),
  distributor: z.string(),
  distributorPartNumber: z.string(),
  productURL: z.string(),
});

export const PartDistributorRowArraySchema = z.array(PartDistributorsSchema);

////////////////////////////////////////////////////////
//
// Distributor Input Schema
// Any distributor name is allowed (eBay, McMaster-Carr, ...), stored as typed.
// The one exception: if it is a distributor the app has an integration for
// ("Digi-Key", "digikey", " Mouser "), it is stored as that integration's code
// ("digikey", "mouser") so lookups by code keep working.
//
////////////////////////////////////////////////////////
export const DistributorInputSchema = z
  .string()
  .trim()
  .min(1, 'distributorName is required')
  .max(100, 'distributorName is too long (max 100 characters)')
  .transform((name) => {
    const squashed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return DISTRIBUTORS.find((code) => code === squashed) ?? name;
  });

////////////////////////////////////////////////////////
//
// Add Part Distributor Schema
// (input of PartDistributorService.addPartDistributor - one partDistributors row)
//
////////////////////////////////////////////////////////
export const AddPartDistributorSchema = z.object({
  partId: z.number().int().positive(),
  distributor: DistributorInputSchema,
  distributorPartNumber: z.string().trim().min(1).max(255),
  productUrl: z
    .string()
    .trim()
    .max(2048)
    .nullable()
    .optional()
    .transform((v) => v || null),
});

export type AddPartDistributorDto = z.infer<typeof AddPartDistributorSchema>;
