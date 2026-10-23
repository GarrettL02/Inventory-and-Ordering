import { z } from 'zod';

// The distributors the app supports. Adding one means adding its API code
// anyway, so the list lives here instead of in a database table.
// partDistributors.distributor stores one of these codes.
export const DISTRIBUTORS = ['digikey', 'mouser'] as const;

export const DistributorSchema = z.enum(DISTRIBUTORS);

export type Distributor = z.infer<typeof DistributorSchema>;

// Display name and website for each distributor (for the UI and for matching pasted links)
export const DISTRIBUTOR_INFO: Record<
  Distributor,
  { name: string; domain: string }
> = {
  digikey: { name: 'Digi-Key', domain: 'digikey.com' },
  mouser: { name: 'Mouser', domain: 'mouser.com' },
};
