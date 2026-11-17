import { useState, useEffect } from 'react';
import { DigikeyResult } from '../../schemas/parts/digikey.schema';
import { getDigikeyForPart } from '../../services/digikey/digikeyService';

export const useFetchDigikey = (partId: number) => {
  const [digikeyData, setDigikeyData] = useState<DigikeyResult>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDigikeyForPart(partId)
      .then(setDigikeyData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [partId]);

  return { digikeyData, loading, error };
};
