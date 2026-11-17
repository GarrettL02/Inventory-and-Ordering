import {
  DigikeyResult,
  DigikeyResultSchema,
} from '../../schemas/parts/digikey.schema';

export const getDigikeyForPart = async (
  partId: number,
): Promise<DigikeyResult> => {
  const res = await fetch(`/api/digikey/part/${partId}`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return DigikeyResultSchema.parse(await res.json());
};
