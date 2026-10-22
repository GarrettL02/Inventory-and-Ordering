import { useEffect, useState } from 'react';
import { getLowStockPartById } from '../../services/lowStockParts/lowStockPartsService';
import { LowStockPart } from '../types/lowStockParts';

export const useFetchLowStockPartsById = (id: number) => {
  const [parts, setParts] = useState<LowStockPart>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLowStockPartById(id);
        setParts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { parts, loading, error };
};
