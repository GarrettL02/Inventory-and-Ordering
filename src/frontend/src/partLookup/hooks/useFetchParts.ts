import { useEffect, useRef, useState } from 'react';
import { getParts } from '../../services/parts/partsService';
import { PartTableData } from '../types/Part';

export const useFetchParts = (initialPage: number) => {
  const [parts, setParts] = useState<PartTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [search, setSearch] = useState<string>('');
  // Bumping this re-runs the fetch below (used after a part is added, deleted
  // or has its stock changed)
  const [refreshKey, setRefreshKey] = useState(0);
  // True when the next fetch is a refetch(): keep the rows on screen instead of
  // showing the loading state, so expanded rows stay open
  const silentRefresh = useRef(false);

  // Reset to page 1 whenever search text changes
  useEffect(() => {
    if (search) setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!silentRefresh.current) setLoading(true);
      silentRefresh.current = false;
      setError(null);
      try {
        const data = await getParts(page, 15, search);
        setParts(data.data);
        setPagination(data.pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search, refreshKey]);

  return {
    parts,
    loading,
    error,
    pagination,
    page,
    setPage,
    search,
    setSearch,
    refetch: () => {
      silentRefresh.current = true;
      setRefreshKey((key) => key + 1);
    },
  };
};
