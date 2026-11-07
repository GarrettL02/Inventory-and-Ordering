import { useAuth } from '../../auth/hooks/useAuth';
import { InventoryValuationComponent } from '../components/InventoryValuationComponent';
import { PartsNoCostComponent } from '../components/PartsNoCostComponent';
import { RecentOrderedComponent } from '../components/ReccentOrderedComponent';
import { RecentLowStockComponent } from '../components/RecentLowStockComponent';
import { RecentStockMovementsComponent } from '../components/RecentStockMovementsComponent';
import { TasksComponent } from '../components/TasksComponent';

export function HomePage() {
  const { user } = useAuth();
  return (
    <div
      style={{
        boxSizing: 'border-box',
        overflow: 'hidden',
        paddingBottom: '2rem',
        paddingTop: '40px', //Needed on all pages to offset header
        paddingLeft: '50px',
      }}
    >
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>
          {`Welcome${user?.username ? `, ${user.username}` : ''}`}
        </h2>
        <p style={{ color: '#a7a7a7', fontSize: '14px', margin: '6px 0 0' }}>
          Here&rsquo;s what&rsquo;s happening with your parts.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1.8fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TasksComponent />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <RecentLowStockComponent />
            <RecentOrderedComponent />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InventoryValuationComponent />
          <PartsNoCostComponent />
        </div>

        <RecentStockMovementsComponent />
      </div>
    </div>
  );
}
