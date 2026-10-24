import { Injectable, Logger } from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import {
  DigikeyKeywordResponseSchema,
  DigikeyProduct,
  DigikeyResponseSchema,
  DigikeyResult,
  ManufacturerPartNumberRowArraySchema,
} from './schema/digikey.schema';

const CACHE_MS = 10 * 60 * 1000;
// A manufacturer part number -> DigiKey product number match rarely changes,
// so keep it longer to save API calls (misses only use the short cache)
const PRODUCT_NUMBER_CACHE_MS = 24 * 60 * 60 * 1000;

// Compare part numbers ignoring case and spaces
const normalize = (value?: string | null) =>
  (value ?? '').replace(/\s+/g, '').toLowerCase();

@Injectable()
export class DigikeyService {
  private readonly logger = new Logger(DigikeyService.name);
  private token: { value: string; expiresAt: number } | null = null;
  private cache = new Map<
    string,
    { data: DigikeyProduct; expiresAt: number }
  >();
  private productNumberCache = new Map<
    string,
    { productNumber: string | null; expiresAt: number }
  >();

  constructor(private readonly db: InventoryDatabaseService) {}

  // Build an error that includes what DigiKey said, so the backend log explains the failure
  private async failure(what: string, res: Response): Promise<Error> {
    const body = (await res.text().catch(() => '')).slice(0, 500);
    return new Error(
      `${what} failed (${res.status})${body ? `: ${body}` : ''}`,
    );
  }

  private get baseUrl() {
    return process.env.DIGIKEY_API_URL ?? 'https://api.digikey.com';
  }

  /////////////////////////////////////////////////////////
  //
  //  getToken()
  //  Get a valid DigiKey API token
  //
  /////////////////////////////////////////////////////////
  private async getToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt)
      return this.token.value;

    if (!process.env.DIGIKEY_CLIENT_ID || !process.env.DIGIKEY_CLIENT_SECRET) {
      throw new Error(
        'DIGIKEY_CLIENT_ID and DIGIKEY_CLIENT_SECRET must be set in .env',
      );
    }

    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DIGIKEY_CLIENT_ID ?? '',
        client_secret: process.env.DIGIKEY_CLIENT_SECRET ?? '',
        grant_type: 'client_credentials',
      }),
    });
    if (!res.ok) throw await this.failure('DigiKey token request', res);

    const json = await res.json();
    this.token = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in - 60) * 1000,
    };
    return this.token.value;
  }

  /////////////////////////////////////////////////////////
  //
  //  apiHeaders()
  //  Headers every DigiKey product API request needs
  //
  /////////////////////////////////////////////////////////
  private async apiHeaders(): Promise<Record<string, string>> {
    return {
      Authorization: `Bearer ${await this.getToken()}`,
      'X-DIGIKEY-Client-Id': process.env.DIGIKEY_CLIENT_ID ?? '',
      'X-DIGIKEY-Locale-Site': 'US',
      'X-DIGIKEY-Locale-Language': 'en',
      'X-DIGIKEY-Locale-Currency': 'USD',
    };
  }

  /////////////////////////////////////////////////////////
  //
  //  getManufacturerPartNumber()
  //  Get the manufacturer part number saved on a part
  //
  /////////////////////////////////////////////////////////
  private async getManufacturerPartNumber(
    partId: number,
  ): Promise<string | null> {
    const rows = await this.db.query(
      'SELECT manufacturerPartNumber FROM parts WHERE id = ?',
      [partId],
    );
    return (
      ManufacturerPartNumberRowArraySchema.parse(
        rows,
      )[0]?.manufacturerPartNumber?.trim() || null
    );
  }

  /////////////////////////////////////////////////////////
  //
  //  findProductNumber()
  //  Search DigiKey for a manufacturer part number and return the DigiKey
  //  product number of the exact match (null if there isn't one)
  //
  /////////////////////////////////////////////////////////
  private async findProductNumber(
    manufacturerPartNumber: string,
  ): Promise<string | null> {
    const cacheKey = normalize(manufacturerPartNumber);
    const cached = this.productNumberCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) return cached.productNumber;

    const res = await fetch(`${this.baseUrl}/products/v4/search/keyword`, {
      method: 'POST',
      headers: {
        ...(await this.apiHeaders()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Keywords: manufacturerPartNumber,
        Limit: 10,
        Offset: 0,
      }),
    });
    if (!res.ok) throw await this.failure('DigiKey keyword search', res);

    const { Products, ExactMatches } = DigikeyKeywordResponseSchema.parse(
      await res.json(),
    );

    // Only accept a product whose manufacturer part number really matches -
    // a keyword search also returns similar parts, and showing the wrong one is worse than none
    const match = [...(ExactMatches ?? []), ...(Products ?? [])].find(
      (product) => normalize(product.ManufacturerProductNumber) === cacheKey,
    );

    const productNumber = match
      ? (match.ProductVariations?.[0]?.DigiKeyProductNumber ??
        manufacturerPartNumber)
      : null;

    this.productNumberCache.set(cacheKey, {
      productNumber,
      expiresAt:
        Date.now() + (productNumber ? PRODUCT_NUMBER_CACHE_MS : CACHE_MS),
    });
    return productNumber;
  }

  /////////////////////////////////////////////////////////
  //
  //  fetchProduct()
  //  Fetch product details from DigiKey API
  //
  /////////////////////////////////////////////////////////
  private async fetchProduct(
    productNumber: string,
  ): Promise<DigikeyProduct | null> {
    const cached = this.cache.get(productNumber);
    if (cached && Date.now() < cached.expiresAt) return cached.data;

    const res = await fetch(
      `${this.baseUrl}/products/v4/search/${encodeURIComponent(productNumber)}/productdetails`,
      { headers: await this.apiHeaders() },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw await this.failure('DigiKey productdetails', res);

    const raw = await res.json();
    this.logger.debug(JSON.stringify(raw, null, 2)); // TEMPORARY: remove after step 2

    const p = DigikeyResponseSchema.parse(raw).Product;
    const variation =
      p.ProductVariations?.find(
        (v) => v.DigiKeyProductNumber === productNumber,
      ) ?? p.ProductVariations?.[0];

    const data: DigikeyProduct = {
      digikeyPartNumber: variation?.DigiKeyProductNumber ?? productNumber,
      description: p.Description?.ProductDescription ?? null,
      status: p.ProductStatus?.Status ?? null,
      unitPrice: p.UnitPrice ?? null,
      quantityAvailable: p.QuantityAvailable ?? null,
      productUrl: p.ProductUrl ?? null,
      datasheetUrl: p.DatasheetUrl ?? null,
      priceBreaks: (variation?.StandardPricing ?? []).map((b) => ({
        quantity: b.BreakQuantity,
        unitPrice: b.UnitPrice,
      })),
    };
    this.cache.set(productNumber, { data, expiresAt: Date.now() + CACHE_MS });
    return data;
  }

  /////////////////////////////////////////////////////////
  //
  //  getForPart()
  //  Get DigiKey product information for a given part ID, found by
  //  searching DigiKey with the part's manufacturer part number
  //
  /////////////////////////////////////////////////////////
  async getForPart(partId: number): Promise<DigikeyResult> {
    try {
      const manufacturerPartNumber =
        await this.getManufacturerPartNumber(partId);
      if (!manufacturerPartNumber) return { state: 'no-part-number' };

      const productNumber = await this.findProductNumber(
        manufacturerPartNumber,
      );
      if (!productNumber) return { state: 'not-found' };

      const data = await this.fetchProduct(productNumber);
      return data ? { state: 'ok', data } : { state: 'not-found' };
    } catch (err: any) {
      this.logger.error(err?.message ?? err);
      return {
        state: 'unavailable',
        message: 'DigiKey data is unavailable right now.',
      };
    }
  }
}
