import { Injectable, Logger } from '@nestjs/common';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import {
  DigikeyPartNumberRowArraySchema,
  DigikeyProduct,
  DigikeyResponseSchema,
  DigikeyResult,
} from './schema/digikey.schema';

const CACHE_MS = 10 * 60 * 1000;

@Injectable()
export class DigikeyService {
  private readonly logger = new Logger(DigikeyService.name);
  private token: { value: string; expiresAt: number } | null = null;
  private cache = new Map<
    string,
    { data: DigikeyProduct; expiresAt: number }
  >();

  constructor(private readonly db: InventoryDatabaseService) {}

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

    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DIGIKEY_CLIENT_ID ?? '',
        client_secret: process.env.DIGIKEY_CLIENT_SECRET ?? '',
        grant_type: 'client_credentials',
      }),
    });
    if (!res.ok)
      throw new Error(`DigiKey token request failed (${res.status})`);

    const json = await res.json();
    this.token = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in - 60) * 1000,
    };
    return this.token.value;
  }

  /////////////////////////////////////////////////////////
  //
  //  getDigikeyPartNumber()
  //  Get the DigiKey part number for a given part ID
  //
  /////////////////////////////////////////////////////////
  private async getDigikeyPartNumber(partId: number): Promise<string | null> {
    const rows = await this.db.query(
      `SELECT pm.partNumber
       FROM partManufacturers pm
       JOIN manufacturers m ON m.id = pm.manufacturerId
       WHERE pm.partId = ? AND m.name LIKE ?
       LIMIT 1`,
      [partId, '%digikey%'],
    );
    return (
      DigikeyPartNumberRowArraySchema.parse(rows)[0]?.partNumber?.trim() || null
    );
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
      {
        headers: {
          Authorization: `Bearer ${await this.getToken()}`,
          'X-DIGIKEY-Client-Id': process.env.DIGIKEY_CLIENT_ID ?? '',
          'X-DIGIKEY-Locale-Site': 'US',
          'X-DIGIKEY-Locale-Language': 'en',
          'X-DIGIKEY-Locale-Currency': 'USD',
        },
      },
    );
    if (res.status === 404) return null;
    if (!res.ok)
      throw new Error(`DigiKey productdetails failed (${res.status})`);

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
  //  Get DigiKey product information for a given part ID
  //
  /////////////////////////////////////////////////////////
  async getForPart(partId: number): Promise<DigikeyResult> {
    try {
      const number = await this.getDigikeyPartNumber(partId);
      if (!number) return { state: 'no-digikey-entry' };
      const data = await this.fetchProduct(number);
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
