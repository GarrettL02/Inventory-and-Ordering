import { z } from 'zod';

export const DigikeyResponseSchema = z.object({
  Product: z.object({
    Description: z
      .object({ ProductDescription: z.string().nullish() })
      .nullish(),
    UnitPrice: z.number().nullish(),
    QuantityAvailable: z.number().nullish(),
    ProductUrl: z.string().nullish(),
    DatasheetUrl: z.string().nullish(),
    ProductStatus: z.object({ Status: z.string().nullish() }).nullish(),
    ProductVariations: z
      .array(
        z.object({
          DigiKeyProductNumber: z.string().nullish(),
          StandardPricing: z
            .array(
              z.object({ BreakQuantity: z.number(), UnitPrice: z.number() }),
            )
            .nullish(),
        }),
      )
      .nullish(),
  }),
});

////////////////////////////////////////////////////////
//
// DigiKey Part Number Row Schema
// (the row getDigikeyPartNumber() reads from partManufacturers)
//
////////////////////////////////////////////////////////
export const DigikeyPartNumberRowSchema = z.object({
  partNumber: z.string().nullable(),
});

export const DigikeyPartNumberRowArraySchema = z.array(
  DigikeyPartNumberRowSchema,
);

export type DigikeyProduct = {
  digikeyPartNumber: string;
  description: string | null;
  status: string | null;
  unitPrice: number | null;
  quantityAvailable: number | null;
  productUrl: string | null;
  datasheetUrl: string | null;
  priceBreaks: { quantity: number; unitPrice: number }[];
};

export type DigikeyResult =
  | { state: 'ok'; data: DigikeyProduct }
  | { state: 'no-digikey-entry' }
  | { state: 'not-found' }
  | { state: 'unavailable'; message: string };
