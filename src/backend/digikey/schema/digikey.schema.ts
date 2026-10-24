import { z } from 'zod';

////////////////////////////////////////////////////////
//
// DigiKey product details response
// (GET /products/v4/search/{productNumber}/productdetails)
//
////////////////////////////////////////////////////////
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
// DigiKey keyword search response
// (POST /products/v4/search/keyword) - only the fields needed to turn a
// manufacturer part number into a DigiKey product number
//
////////////////////////////////////////////////////////
const DigikeyKeywordProductSchema = z.object({
  ManufacturerProductNumber: z.string().nullish(),
  ProductVariations: z
    .array(z.object({ DigiKeyProductNumber: z.string().nullish() }))
    .nullish(),
});

export const DigikeyKeywordResponseSchema = z.object({
  Products: z.array(DigikeyKeywordProductSchema).nullish(),
  ExactMatches: z.array(DigikeyKeywordProductSchema).nullish(),
});

////////////////////////////////////////////////////////
//
// Manufacturer Part Number Row Schema
// (the row getManufacturerPartNumber() reads from the parts table)
//
////////////////////////////////////////////////////////
export const ManufacturerPartNumberRowSchema = z.object({
  manufacturerPartNumber: z.string().nullable(),
});

export const ManufacturerPartNumberRowArraySchema = z.array(
  ManufacturerPartNumberRowSchema,
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
  | { state: 'no-part-number' } // the part has no manufacturer part number to search with
  | { state: 'not-found' } // DigiKey has no exact match for it
  | { state: 'unavailable'; message: string };
