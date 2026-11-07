import { useEffect, useState } from 'react';
import {
  getPartById,
  getPartValuation,
} from '../../services/parts/partsService';
import { PartDetails, PartValuation } from '../../types/parts/Part';

export const useFetchPartValuation = () => {
  const [partValue, setPartValue] = useState<PartValuation>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPartValuation();
        setPartValue(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    partValue,
    loading,
    error,
  };
};
