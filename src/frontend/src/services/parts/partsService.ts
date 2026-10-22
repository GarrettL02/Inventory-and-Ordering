import { z } from 'zod';
import { PartViewSchema } from '../../schemas/parts/partsView.schema';
import { PartDetails, PartTableData } from '../../partLookup/types/Part';
import { PartTableDataSchema } from '../../schemas/parts/parts.schema';

const BASE_URL = '/api/parts';

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
