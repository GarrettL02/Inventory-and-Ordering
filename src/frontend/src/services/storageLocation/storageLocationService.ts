import z from 'zod';
import { StorageLocationDataSchema } from '../../schemas/storageLocation/storageLocation';
import { StorageLocationData } from '../../types/storageLocation/storageLocation';

const BASE_URL = '/api/storagelocations';

export const getAllStorageLocations = async (): Promise<{
  data: StorageLocationData[];
}> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  const validatedData = z.array(StorageLocationDataSchema).parse(data.data);
  return { data: validatedData };
};

export const getstorageLocationDataById = async (
  storageLocationId: number,
): Promise<{
  data: StorageLocationData[];
}> => {
  // Construct the URL dynamically with query params
  let url = `${BASE_URL}/${storageLocationId}`;

  //Response is the fetched data from api url
  const res = await fetch(url);

  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  // Validate only the data array with your existing schema
  const validatedData = z.array(StorageLocationDataSchema).parse(data.data);
  // Return the full response structure
  return { data: validatedData };
};
