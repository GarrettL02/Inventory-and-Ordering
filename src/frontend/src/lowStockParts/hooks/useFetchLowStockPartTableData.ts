import { useEffect, useState, useCallback } from 'react';
import { LowStockTableRow } from '../types/lowStockParts';
import { getLowStockTableData } from '../../services/lowStockParts/lowStockPartsService';

export const useFetchLowStockPartsTableData = (initialPage: number) => {
  const [lowStockTableData, setLowStockTableData] = useState<
    LowStockTableRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLowStockTableData(page, 15);
      setLowStockTableData(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    lowStockTableData,
    loading,
    error,
    page,
    setPage,
    pagination,
    refetch: fetchData,
  };
};
