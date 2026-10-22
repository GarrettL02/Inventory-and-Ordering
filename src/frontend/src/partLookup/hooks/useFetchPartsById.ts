import { useEffect, useState } from 'react';
import { getPartById } from '../../services/parts/partsService';
import { PartDetails } from '../types/Part';

export const useFetchPartsById = (id: number) => {
  const [parts, setParts] = useState<PartDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [id]);

  return { parts, loading, error };
};
