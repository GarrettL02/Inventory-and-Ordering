import { useEffect, useRef, useState } from 'react';
import { PartDistributorData } from '../../types/partDistributors/partDistributors';
import { getPartDistributorById } from '../../services/partDistributors/partDistributorsService';

export const useFetchPartDistributorById = (partId: number) => {
  const [partDistributorData, setPartDistributorData] = useState<
    PartDistributorData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this re-runs the fetch below (used after the stock is changed)
  const [refreshKey, setRefreshKey] = useState(0);
  // True when the next fetch is a refetch(): update the rows in place instead of
  // showing the loading state
  const silentRefresh = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!silentRefresh.current) setLoading(true);
      silentRefresh.current = false;
      setError(null);
      try {
        const data = await getPartDistributorById(partId);
        setPartDistributorData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  return {
    partDistributorData,
    loading,
    error,
    refetch: () => {
      silentRefresh.current = true;
      setRefreshKey((key) => key + 1);
    },
  };
};
