import {
  PartDistributorDataArraySchema,
  PartDistributorDataSchema,
} from '../../schemas/partDistributors/partDistributors.schema';
import { PartDistributorData } from '../../types/partDistributors/partDistributors';

const BASE_URL = '/api/partdistributor';

// Build an Error from a failed response, using the message the Nest backend sends
// ({ message: '...' } for a 400 / 404), or a generic HTTP error if there isn't one
const responseError = async (res: Response): Promise<Error> => {
  const body = await res.json().catch(() => null);
  const message = Array.isArray(body?.message)
    ? body.message.join(', ')
    : body?.message;
  return new Error(message ?? `HTTP error ${res.status}`);
};

export const getPartDistributorById = async (
  id: number,
): Promise<PartDistributorData[]> => {
  //Response is the fetched data from api url and the give ID of the part
  const res = await fetch(`${BASE_URL}/${id}`);
  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good. Make it of Type PartDistributorData[] and await the response in json format
  const data = await res.json();
  //return the data - passing the data through the part distributor zod schema
  return PartDistributorDataArraySchema.parse(data);
};

export const addPartDistributor = async (
  partId: number,
  data: PartDistributorData,
) => {
  const res = await fetch(`${BASE_URL}/${partId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ partId, data }),
  });
  if (!res.ok) throw await responseError(res);

  return PartDistributorDataSchema.parse(await res.json());
};
