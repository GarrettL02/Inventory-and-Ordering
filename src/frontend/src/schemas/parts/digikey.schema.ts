import z from 'zod';

const DigikeyProductSchema = z.object({
  digikeyPartNumber: z.string(),
  description: z.string().nullable(),
  status: z.string().nullable(),
  unitPrice: z.number().nullable(),
  quantityAvailable: z.number().nullable(),
  productUrl: z.string().nullable(),
  datasheetUrl: z.string().nullable(),
  priceBreaks: z.array(
    z.object({ quantity: z.number(), unitPrice: z.number() }),
  ),
});

export const DigikeyResultSchema = z.discriminatedUnion('state', [
  z.object({ state: z.literal('ok'), data: DigikeyProductSchema }),
  z.object({ state: z.literal('no-digikey-entry') }),
  z.object({ state: z.literal('not-found') }),
  z.object({ state: z.literal('unavailable'), message: z.string() }),
]);
export type DigikeyResult = z.infer<typeof DigikeyResultSchema>;
