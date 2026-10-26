import { useEffect, useState } from 'react';
import { getPartById } from '../../services/parts/partsService';
import { PartDetails } from '../types/Part';

export const useFetchPartsById = (id: number) => {
  const [parts, setParts] = useState<PartDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this re-runs the fetch below (used after the stock is changed).
  // `loading` only starts as true, so a refetch updates the numbers in place
  // without flashing the loading message.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPartById(id);
        setParts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, refreshKey]);

  return {
    parts,
    loading,
    error,
    refetch: () => setRefreshKey((key) => key + 1),
  };
};
