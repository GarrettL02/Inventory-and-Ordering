import { formatShortDate } from '../../functions';
import { useFetchRecentStockMovements } from '../../hooks/stockMovements/useFetchRecentStockMovements';
import { HomeCard, homeCardMessageStyle } from './HomeCard';

const title = 'Recent Stock Movements';

// One template shared by the header and every row so the columns line up
const gridColumns =
  'minmax(0, 2fr) 56px minmax(0, 1.2fr) minmax(0, 1.8fr) minmax(0, 1.2fr)';

export function RecentStockMovementsComponent() {
  const { stockMovementData, loading, error } = useFetchRecentStockMovements();
  // Wrap long text onto a second line instead of cutting it off, so nothing
  // disappears when the panel is narrow
  const cellStyle = {
    overflowWrap: 'anywhere',
  } as const;

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: gridColumns,
    alignItems: 'start',
    columnGap: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as const;

  return (
    <HomeCard
      title={title}
      count={!loading && !error ? stockMovementData.length : undefined}
    >
      {loading && <p style={homeCardMessageStyle}>Loading...</p>}
      {error && !loading && (
        <p style={{ ...homeCardMessageStyle, color: '#ef5350' }}>{error}</p>
      )}
      {!loading && !error && stockMovementData.length === 0 && (
        <p style={homeCardMessageStyle}>No recent stock movements yet.</p>
      )}
      {!loading && !error && stockMovementData.length > 0 && (
        <div>
          {/* Header row */}
          <div
            style={{
              ...rowStyle,
              padding: '10px 20px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#8a8a8a',
              borderBottom: '1px solid #2e2e2e',
            }}
          >
            <div>Part</div>
            <div style={{ textAlign: 'right' }}>Change</div>
            <div>By</div>
            <div>Reason</div>
            <div style={{ textAlign: 'right' }}>Date</div>
          </div>

          {/* Scrollable body */}
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: '420px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {stockMovementData.map((m, index) => (
              <li
                key={index}
                className="storage-location-row"
                style={{
                  ...rowStyle,
                  borderTop: index === 0 ? 'none' : '1px solid #2e2e2e',
                }}
              >
                <div style={cellStyle} title={m.partName}>
                  {m.partName}
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    fontWeight: 600,
                    color: m.delta >= 0 ? '#4caf50' : '#ef5350',
                  }}
                >
                  {m.delta > 0 ? `+${m.delta}` : m.delta}
                </div>
                <div
                  style={{ ...cellStyle, color: '#cfcfcf' }}
                  title={m.userName ?? ''}
                >
                  {m.userName ?? '—'}
                </div>
                <div
                  style={{ ...cellStyle, color: '#cfcfcf' }}
                  title={m.reason}
                >
                  {m.reason}
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: '#a7a7a7',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {formatShortDate(m.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </HomeCard>
  );
}
