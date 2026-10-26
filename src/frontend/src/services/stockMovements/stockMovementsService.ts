import z from 'zod';
import { StockMovementsData } from '../../types/stockMovements/stockMovements';
import {
  AdjustStockResult,
  AdjustStockResultSchema,
  StockMovementsDataSchema,
} from '../../schemas/stockMovements/stockMovements.schema';

const BASE_URL = '/api/stockMovements';

// Build an Error from a failed response, using the message the Nest backend sends
// ({ message: '...' } for a 400 / 404), or a generic HTTP error if there isn't one
const responseError = async (res: Response): Promise<Error> => {
  const body = await res.json().catch(() => null);
  const message = Array.isArray(body?.message)
    ? body.message.join(', ')
    : body?.message;
  return new Error(message ?? `HTTP error ${res.status}`);
};

export const getStockMovementsData = async (
  partId: number,
): Promise<{
  data: StockMovementsData[];
}> => {
  // Construct the URL dynamically with query params
  let url = `${BASE_URL}/${partId}`;

  //Response is the fetched data from api url
  const res = await fetch(url);

  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  // Validate only the data array with your existing schema
  const validatedData = z.array(StockMovementsDataSchema).parse(data.data);
  // Return the full response structure
  return { data: validatedData };
};

// Add or remove stock for a part. delta > 0 adds, delta < 0 removes.
// reason is optional (the backend defaults it to 'manual').
// Returns the part's new stock level. Throws an Error with the server's message if it
// is rejected (e.g. 'Stock level cannot go below 0').
export const adjustPartStock = async (
  partId: number,
  delta: number,
  reason?: string,
): Promise<AdjustStockResult> => {
  const res = await fetch(`${BASE_URL}/${partId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(reason ? { delta, reason } : { delta }),
  });

  if (!res.ok) throw await responseError(res);

  return AdjustStockResultSchema.parse(await res.json());
};
