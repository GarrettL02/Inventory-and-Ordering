import { StorageLocationDataSchema } from '../../schemas/storageLocation/storageLocation';
import z from 'zod';
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

// Get one storage location. The backend answers { data: { id, name } } -
// a single object, not an array like the "get all" endpoint.
export const getStorageLocationDataById = async (
  storageLocationId: number,
): Promise<{
  data: StorageLocationData;
}> => {
  //Response is the fetched data from api url
  const res = await fetch(`${BASE_URL}/${storageLocationId}`);

  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  // Validate the single location with the zod schema
  const validatedData = StorageLocationDataSchema.parse(data.data);
  // Return the full response structure
  return { data: validatedData };
};

// Create a new storage location. Returns the created location.
// Throws an Error with the backend's message on failure, e.g. a 409 when the
// name already exists ("A storage location named "..." already exists").
export const createStorageLocation = async (
  name: string,
): Promise<StorageLocationData> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });

  // 400 (bad name) and 409 (already exists) come with a message from the backend
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;
    throw new Error(message ?? `HTTP error ${res.status}`);
  }

  const json = await res.json();
  return StorageLocationDataSchema.parse(json.data);
};

export const deleteStorageLocation = async (
  storageLocationId: number,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${storageLocationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    // 404 (not found) and 409 (parts still stored there) come with a message from the backend
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;
    throw new Error(message ?? `HTTP error ${res.status}`);
  }
};
