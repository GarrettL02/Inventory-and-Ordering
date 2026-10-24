import { Logger } from '@nestjs/common';
import { DigikeyService } from './digikey.service';

// ---------------------------------------------------------------------
// Faking the network. DigikeyService calls the global fetch() three times for
// one lookup (token -> keyword search -> product details). jest.spyOn swaps
// fetch for a fake that answers from the `routes` table below, so these tests
// never touch the internet or need real DigiKey credentials.
//
// Each route returns a FRESH Response because a response body can only be
// read once.
// ---------------------------------------------------------------------
type Routes = Record<string, () => Response>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function routeFetch(routes: Routes) {
  return jest.spyOn(global, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    const match = Object.keys(routes).find((fragment) =>
      url.includes(fragment),
    );
    if (!match) throw new Error(`Unexpected fetch in test: ${url}`);
    return routes[match]();
  });
}

const tokenRoute = () => json({ access_token: 'tok-123', expires_in: 3600 });

const keywordRoute =
  (mpn = 'LM317T') =>
  () =>
    json({
      ExactMatches: [
        {
          ManufacturerProductNumber: mpn,
          ProductVariations: [{ DigiKeyProductNumber: 'LM317T-ND' }],
        },
      ],
      Products: [],
    });

const detailsRoute = () =>
  json({
    Product: {
      Description: { ProductDescription: 'IC REG LINEAR 1.25V' },
      UnitPrice: 0.5,
      QuantityAvailable: 100,
      ProductUrl: 'https://www.digikey.com/en/products/detail/lm317t',
      DatasheetUrl: 'https://example.com/lm317t.pdf',
      ProductStatus: { Status: 'Active' },
      ProductVariations: [
        {
          DigiKeyProductNumber: 'LM317T-ND',
          StandardPricing: [
            { BreakQuantity: 1, UnitPrice: 0.5 },
            { BreakQuantity: 10, UnitPrice: 0.4 },
          ],
        },
      ],
    },
  });

describe('DigikeyService', () => {
  const originalEnv = process.env;
  let db: { query: jest.Mock };
  let service: DigikeyService;
  let fetchSpy: jest.SpyInstance | undefined;

  const partHasMpn = (mpn: string | null) =>
    db.query.mockResolvedValue([{ manufacturerPartNumber: mpn }]);

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DIGIKEY_CLIENT_ID: 'client-id',
      DIGIKEY_CLIENT_SECRET: 'client-secret',
      DIGIKEY_API_URL: 'https://digikey.test',
    };

    // The service logs errors/debug output; keep the test output clean
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);

    db = { query: jest.fn() };
    service = new DigikeyService(db as any); // new instance = empty caches
  });

  afterEach(() => {
    jest.restoreAllMocks(); // put the real fetch and Logger back
    fetchSpy = undefined;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns the product when DigiKey has an exact match', async () => {
    partHasMpn('LM317T');
    fetchSpy = routeFetch({
      '/oauth2/token': tokenRoute,
      '/search/keyword': keywordRoute(),
      '/productdetails': detailsRoute,
    });

    const result = await service.getForPart(1);

    expect(result).toEqual({
      state: 'ok',
      data: {
        digikeyPartNumber: 'LM317T-ND',
        description: 'IC REG LINEAR 1.25V',
        status: 'Active',
        unitPrice: 0.5,
        quantityAvailable: 100,
        productUrl: 'https://www.digikey.com/en/products/detail/lm317t',
        datasheetUrl: 'https://example.com/lm317t.pdf',
        priceBreaks: [
          { quantity: 1, unitPrice: 0.5 },
          { quantity: 10, unitPrice: 0.4 },
        ],
      },
    });
  });

  it('searches with the part’s manufacturer part number and sends the access token', async () => {
    partHasMpn('LM317T');
    fetchSpy = routeFetch({
      '/oauth2/token': tokenRoute,
      '/search/keyword': keywordRoute(),
      '/productdetails': detailsRoute,
    });

    await service.getForPart(1);

    const keywordCall = fetchSpy.mock.calls.find(([url]) =>
      String(url).includes('keyword'),
    );
    const init = keywordCall![1] as RequestInit;
    expect(JSON.parse(init.body as string).Keywords).toBe('LM317T');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer tok-123',
    );
  });

  it('ignores case and spaces when matching the part number', async () => {
    partHasMpn('lm 317t');
    fetchSpy = routeFetch({
      '/oauth2/token': tokenRoute,
      '/search/keyword': keywordRoute('LM317T'),
      '/productdetails': detailsRoute,
    });

    await expect(service.getForPart(1)).resolves.toMatchObject({ state: 'ok' });
  });

  describe('when there is nothing to search with', () => {
    it.each([
      ['no manufacturer part number', null],
      ['a blank manufacturer part number', '   '],
    ])(
      'returns no-part-number for %s without calling DigiKey',
      async (_label, mpn) => {
        partHasMpn(mpn);
        fetchSpy = routeFetch({});

        await expect(service.getForPart(1)).resolves.toEqual({
          state: 'no-part-number',
        });
        expect(fetchSpy).not.toHaveBeenCalled();
      },
    );

    it('returns no-part-number when the part does not exist', async () => {
      db.query.mockResolvedValue([]);
      fetchSpy = routeFetch({});

      await expect(service.getForPart(999)).resolves.toEqual({
        state: 'no-part-number',
      });
    });
  });

  describe('when DigiKey has no match', () => {
    it('returns not-found if the search only finds similar parts', async () => {
      partHasMpn('LM317T');
      fetchSpy = routeFetch({
        '/oauth2/token': tokenRoute,
        '/search/keyword': keywordRoute('LM317-SOMETHING-ELSE'),
      });

      // no '/productdetails' route: if the service asked for details of the
      // wrong part, routeFetch would throw and the test would fail
      await expect(service.getForPart(1)).resolves.toEqual({
        state: 'not-found',
      });
    });

    it('returns not-found if the product details come back 404', async () => {
      partHasMpn('LM317T');
      fetchSpy = routeFetch({
        '/oauth2/token': tokenRoute,
        '/search/keyword': keywordRoute(),
        '/productdetails': () => new Response(null, { status: 404 }),
      });

      await expect(service.getForPart(1)).resolves.toEqual({
        state: 'not-found',
      });
    });
  });

  describe('when DigiKey cannot be reached', () => {
    const unavailable = {
      state: 'unavailable',
      message: 'DigiKey data is unavailable right now.',
    };

    it('returns unavailable if the token request fails', async () => {
      partHasMpn('LM317T');
      fetchSpy = routeFetch({
        '/oauth2/token': () => new Response('server error', { status: 500 }),
      });

      await expect(service.getForPart(1)).resolves.toEqual(unavailable);
    });

    it('returns unavailable if the search request fails', async () => {
      partHasMpn('LM317T');
      fetchSpy = routeFetch({
        '/oauth2/token': tokenRoute,
        '/search/keyword': () => new Response('rate limited', { status: 429 }),
      });

      await expect(service.getForPart(1)).resolves.toEqual(unavailable);
    });

    it('returns unavailable if the credentials are not configured', async () => {
      delete process.env.DIGIKEY_CLIENT_ID;
      delete process.env.DIGIKEY_CLIENT_SECRET;
      partHasMpn('LM317T');
      fetchSpy = routeFetch({});

      await expect(service.getForPart(1)).resolves.toEqual(unavailable);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('returns unavailable (not a crash) if DigiKey sends an unexpected response shape', async () => {
      partHasMpn('LM317T');
      fetchSpy = routeFetch({
        '/oauth2/token': tokenRoute,
        '/search/keyword': keywordRoute(),
        '/productdetails': () => json({ nonsense: true }),
      });

      await expect(service.getForPart(1)).resolves.toEqual(unavailable);
    });
  });

  it('caches results so a second lookup makes no new DigiKey requests', async () => {
    partHasMpn('LM317T');
    fetchSpy = routeFetch({
      '/oauth2/token': tokenRoute,
      '/search/keyword': keywordRoute(),
      '/productdetails': detailsRoute,
    });

    await service.getForPart(1);
    await service.getForPart(1);

    expect(fetchSpy).toHaveBeenCalledTimes(3); // token + search + details, once
  });
});
