import { useEffect, useRef, useState } from 'react';
import { UserSettingsData } from '../../schemas/userSettings/userSettings.schema';
import { getUserSettings } from '../../services/userSettings/userSettingsService';

export const useFetchUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettingsData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this re-runs the fetch below (used after a part is added, deleted
  // or has its stock changed)
  const [refreshKey, setRefreshKey] = useState(0);
  // True when the next fetch is a refetch(): keep the rows on screen instead of
  // showing the loading state, so expanded rows stay open
  const silentRefresh = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!silentRefresh.current) setLoading(true);
      silentRefresh.current = false;
      setError(null);
      try {
        const data = await getUserSettings();
        setUserSettings(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  return {
    userSettings,
    loading,
    error,
    refetch: () => {
      silentRefresh.current = true;
      setRefreshKey((key) => key + 1);
    },
  };
};
