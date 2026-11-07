import { useFetchRecentLowStockParts } from '../../hooks/lowStock/useFetchRecentLowStockPart';
import { HomepageListComponent } from './HomepageListComponent';

export function RecentLowStockComponent() {
  const { parts, loading, error } = useFetchRecentLowStockParts();

  return (
    <HomepageListComponent
      itemData={parts}
      loading={loading}
      error={error}
      title={'Recent Low Stock'}
      redirectPage={'lowstock'}
    />
  );
}
