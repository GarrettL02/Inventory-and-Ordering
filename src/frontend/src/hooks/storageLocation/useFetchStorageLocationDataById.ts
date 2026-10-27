import { useEffect, useRef, useState } from 'react';
import { getStorageLocationDataById } from '../../services/storageLocation/storageLocationService';
import { StorageLocationData } from '../../types/storageLocation/storageLocation';

export const useFetchStorageLocationDataById = (storageLocationId: number) => {
  // One location (the backend returns a single object for this endpoint), or null until loaded
  const [storageLocationData, setStorageLocationData] =
    useState<StorageLocationData | null>(null);
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
        const data = await getStorageLocationDataById(storageLocationId);
        setStorageLocationData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storageLocationId, refreshKey]);

  return {
    storageLocationData,
    loading,
    error,
    refetch: () => {
      silentRefresh.current = true;
      setRefreshKey((key) => key + 1);
    },
  };
};
