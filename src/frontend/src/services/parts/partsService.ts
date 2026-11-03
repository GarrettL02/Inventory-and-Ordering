import { z } from 'zod';
import { PartViewSchema } from '../../schemas/parts/partsView.schema';
import {
  AddNewPartFormData,
  PartDetails,
  PartTableData,
} from '../../partLookup/types/Part';
import { PartTableDataSchema } from '../../schemas/parts/parts.schema';

const BASE_URL = '/api/parts';

// Build an Error from a failed response, using the message the Nest backend sends
// ({ message: '...' } for a 400 / 404), or a generic HTTP error if there isn't one
const responseError = async (res: Response): Promise<Error> => {
  const body = await res.json().catch(() => null);
  const message = Array.isArray(body?.message)
    ? body.message.join(', ')
    : body?.message;
  return new Error(message ?? `HTTP error ${res.status}`);
};

export const getParts = async (
  page: number = 1,
  limit: number = 15,
  search: string = '',
): Promise<{
  data: PartTableData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  // Construct the URL dynamically with query params
  let url = `${BASE_URL}?page=${page}&limit=${limit}`;

  //if there is a search in the searchbar, add to url
  if (search.trim() !== '') {
    url += `&search=${encodeURIComponent(search.trim())}`;
  }
  //Response is the fetched data from api url
  const res = await fetch(url);

  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  // Validate only the data array with your existing schema
  const validatedData = z.array(PartTableDataSchema).parse(data.data);
  // Return the full response structure
  return { data: validatedData, pagination: data.pagination };
};

export const getPartById = async (id: number): Promise<PartDetails> => {
  //Response is the fetched data from api url and the give ID of the part
  const res = await fetch(`${BASE_URL}/${id}`);
  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  //return the data and validate it with the part ZOD schema
  return PartViewSchema.parse(data);
};

// Create a new part (the Add New Part form).
// The backend sets internalPartNumber itself (= manufacturer part number),
// so the form data is sent as is. Returns the created part.
export const submitNewPartData = async (
  newPartFormData: AddNewPartFormData,
): Promise<PartDetails> => {
  // Send the form data to the backend as JSON, with credentials included for session auth
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newPartFormData),
  });

  //if the server rejected it, throw its message so the form can show it
  if (!res.ok) throw await responseError(res);

  //Else the part was created - validate the returned part with the part ZOD schema
  return PartViewSchema.parse(await res.json());
};

// Permanently delete a part. The backend answers 204 (no body) when it worked.
export const deletePartById = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  //if the server rejected it (404 = already gone), throw its message
  if (!res.ok) throw await responseError(res);
};

// URL of a part's picture, for an <img src>. Pass the part's `filename` as the
// version: the file name changes on every upload, so a replaced picture isn't
// shown from the browser cache. Only use it when the part has a picture
// (filename is set), otherwise the request is a 404.
export const partImageUrl = (partId: number, filename?: string | null) =>
  `${BASE_URL}/${partId}/image${filename ? `?v=${encodeURIComponent(filename)}` : ''}`;

// Upload or replace a part's picture. The file is sent as the raw request body
// (no FormData) with its own Content-Type; the file name goes in a header.
export const uploadPartImage = async (
  partId: number,
  file: File,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${partId}/image`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'X-File-Name': encodeURIComponent(file.name),
    },
    credentials: 'include',
    body: file,
  });

  if (!res.ok) throw await responseError(res);
};

// Remove a part's picture. The backend answers 204 (no body) when it worked.
export const deletePartImage = async (partId: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${partId}/image`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) throw await responseError(res);
};
