import { useEffect, useState } from 'react';
import {
  getLowStockParts,
  getRecentLowStockParts,
} from '../../services/lowStockParts/lowStockPartsService';
import { RecentLowStockPart } from '../../lowStockParts/types/lowStockParts';

export const useFetchRecentLowStockParts = () => {
  const [parts, setParts] = useState<RecentLowStockPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecentLowStockParts();
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
