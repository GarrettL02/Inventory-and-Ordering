import { useState, useEffect } from 'react';
import { DigikeyResult } from '../../schemas/parts/digikey.schema';
import { getDigikeyForPart } from '../../services/digikey/digikeyService';

// enabled = false makes no request at all (used when the user turned distributor lookups off)
export const useFetchDigikey = (partId: number, enabled = true) => {
  const [digikeyData, setDigikeyData] = useState<DigikeyResult>();
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDigikeyData(undefined);
      setLoading(false);
      return;
    }
    setLoading(true);
    getDigikeyForPart(partId)
      .then(setDigikeyData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [partId, enabled]);

  return { digikeyData, loading, error };
};
