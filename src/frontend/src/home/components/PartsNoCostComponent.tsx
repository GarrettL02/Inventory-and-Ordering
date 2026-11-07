import { useFetchRecentLowStockParts } from '../../hooks/lowStock/useFetchRecentLowStockPart';
import { HomepageListComponent } from './HomepageListComponent';

export function PartsNoCostComponent() {
  const { parts, loading, error } = useFetchRecentLowStockParts();
  return (
    <HomepageListComponent
      title={'Inventory: No Cost Set'}
      itemData={parts}
      error={error}
      loading={loading}
      redirectPage={'noCost'}
    />
  );
}
