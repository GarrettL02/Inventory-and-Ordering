import { useFetchRecentLowStockParts } from '../../hooks/lowStock/useFetchRecentLowStockPart';
import { HomepageListComponent } from './HomepageListComponent';

export function TasksComponent() {
  const { parts, loading, error } = useFetchRecentLowStockParts();

  return (
    <HomepageListComponent
      itemData={parts}
      loading={loading}
      error={error}
      title="Tasks"
      redirectPage="tasks"
    />
  );
}
