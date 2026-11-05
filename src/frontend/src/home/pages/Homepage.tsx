import { useAuth } from '../../auth/hooks/useAuth';
import { RecentOrderedComponent } from '../components/ReccentOrderedComponent';
import { RecentLowStockComponent } from '../components/RecentLowStockComponent';
import { RecentStockMovementsComponent } from '../components/RecentStockMovementsComponent';
import { TasksComponent } from '../components/TasksComponent';

export function HomePage() {
  const { user } = useAuth();
  return (
    <div
      style={{
        transition: 'width 0.3s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        paddingBottom: '1rem',
        paddingTop: '40px', //Needed on all pages to offset header
        paddingLeft: '50px',
      }}
    >
      <div style={{ marginBottom: '25px' }}>
        <h2>{`Welcome ${user?.username}!`}</h2>
        <div style={{ color: '#580909ff', fontWeight: 700 }}>___</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr .6fr',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div style={{ gridColumn: 'span 2' }}>
            <TasksComponent />
          </div>
          <RecentLowStockComponent />
          <RecentOrderedComponent />
        </div>
        <RecentStockMovementsComponent />
      </div>
    </div>
  );
}
