import { useEffect, useRef, useState } from 'react';
import { StockMovementsData } from '../../types/stockMovements/stockMovements';
import { getStockMovementsData } from '../../services/stockMovements/stockMovementsService';

export const useFetchStockMovements = (partId: number) => {
  const [stockMovementData, setstockMovementData] = useState<
    StockMovementsData[]
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
        const data = await getStockMovementsData(partId);
        setstockMovementData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [partId, refreshKey]);

  return {
    stockMovementData,
    loading,
    error,
    refetch: () => {
      silentRefresh.current = true;
      setRefreshKey((key) => key + 1);
    },
  };
};
