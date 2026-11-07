import { useFetchRecentLowStockParts } from '../../hooks/lowStock/useFetchRecentLowStockPart';
import { HomepageListComponent } from './HomepageListComponent';

export function RecentOrderedComponent() {
  const { parts, loading, error } = useFetchRecentLowStockParts();

  return (
    <HomepageListComponent
      itemData={parts}
      loading={loading}
      error={error}
      title={'Recently Ordered'}
      redirectPage={'ordered'}
    />
  );
}
