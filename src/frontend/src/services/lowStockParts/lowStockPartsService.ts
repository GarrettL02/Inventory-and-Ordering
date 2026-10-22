import z from 'zod';
import {
  LowStockPart,
  LowStockTableRow,
} from '../../lowStockParts/types/lowStockParts';
import { LowStockPartsSchema } from '../../lowStockParts/schema/lowStockParts.schema';
import { LowStockTableRowSchema } from '../../lowStockParts/schema/lowStockPartsTableRow.schema';

const BASE_URL = '/api/lowstock';

export const getLowStockParts = async (): Promise<LowStockPart[]> => {
  //Response is the fetched data from api url
  const res = await fetch(BASE_URL);
  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good
  const data = await res.json();
  //return the data - passing the data through the low stock part zod schema
  return z.array(LowStockPartsSchema).parse(data);
};

export const getLowStockPartById = async (
  id: number,
): Promise<LowStockPart> => {
  //Response is the fetched data from api url and the give ID of the part
  const res = await fetch(`${BASE_URL}/${id}`);
  //if there isn't data or is no good - send HTTP error
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  //Else the data is good. Make it of Type LowStockPart and await the response in json format
  const data = await res.json();
  //return the data - passing the data through the low stock part zod schema
  return LowStockPartsSchema.parse(data);
};

export const getLowStockTableData = async (
  page: number = 1,
  limit: number = 15,
): Promise<{
  data: LowStockTableRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await fetch(`${BASE_URL}/tabledata?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const response = await res.json();
  const validatedData = z.array(LowStockTableRowSchema).parse(response.data);

  return {
    data: validatedData,
    pagination: response.pagination,
  };
};
