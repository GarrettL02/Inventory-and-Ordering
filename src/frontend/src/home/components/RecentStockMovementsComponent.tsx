import { useNavigate } from 'react-router-dom';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { formatDateTimeFromDate } from '../../functions';
import { useFetchRecentStockMovements } from '../../hooks/stockMovements/useFetchRecentStockMovements';

const title = 'Recent Stock Movements';

// One template shared by the header and every row so the columns line up
const gridColumns =
  'minmax(0, 2fr) 48px minmax(0, 1.2fr) minmax(0, 1.8fr) minmax(0, 1.6fr)';

export function RecentStockMovementsComponent() {
  const { stockMovementData, loading, error } = useFetchRecentStockMovements();
  const nav = useNavigate();

  const messageStyle = {
    margin: 0,
    padding: '12px 16px',
    color: '#a7a7a7',
    fontSize: '13px',
  };

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
    padding: '10px 16px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as const;

  return (
    <AccordianMenu title={title}>
      {loading && <p style={messageStyle}>Loading...</p>}
      {!loading && !error && stockMovementData.length === 0 && (
        <p style={messageStyle}>No recent stock movements yet.</p>
      )}
      {!loading && !error && stockMovementData.length > 0 && (
        <>
          <div
            style={{
              padding: '0 16px 8px',
              color: '#a7a7a7',
              fontSize: '11px',
              height: 'auto',
            }}
          >
            {`${stockMovementData.length} ${title}`}
          </div>

          <div
            style={{
              border: '1px solid #4a4a4a',
              borderRadius: '8px',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            <div>
              {/* Header row */}
              <div
                style={{
                  ...rowStyle,
                  fontSize: '12px',
                  color: '#a7a7a7',
                  borderBottom: '1px solid #4a4a4a',
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
                  maxHeight: '280px',
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
                      borderTop: index === 0 ? 'none' : '1px solid #333333',
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
                    <div style={cellStyle} title={m.userName ?? ''}>
                      {m.userName ?? '—'}
                    </div>
                    <div style={cellStyle} title={m.reason}>
                      {m.reason}
                    </div>
                    <div
                      style={{
                        textAlign: 'right',
                        color: '#a7a7a7',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {formatDateTimeFromDate(m.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </AccordianMenu>
  );
}
