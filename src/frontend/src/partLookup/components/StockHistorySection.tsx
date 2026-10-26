import { StockChangeComponent } from '../../components/stockChange/StockChangeComponent';
import { useFetchStockMovements } from '../../hooks/stockMovements/useFetchStockMovements';

interface StockHistorySectionProps {
  partId: number;
  stockLevel: number;
  // Called after the stock was changed, so the page can refresh the part's stock level
  onStockChanged?: () => void;
}

const headerCell: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#a7a7a7',
  borderBottom: '1px solid #4a4a4a',
  position: 'sticky',
  top: 0,
  backgroundColor: '#212121', // so rows don't show through when scrolling
  whiteSpace: 'nowrap',
};

const cell: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  borderBottom: '1px solid #333',
};

// +5 / -2 (a negative number already has its minus sign)
const formatDelta = (delta: number) => (delta > 0 ? `+${delta}` : `${delta}`);

const formatDate = (date: Date) =>
  date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function StockHistorySection({
  partId,
  stockLevel,
  onStockChanged,
}: StockHistorySectionProps) {
  const { stockMovementData, loading, error, refetch } =
    useFetchStockMovements(partId);

  // Newest first (the backend doesn't guarantee an order)
  const movements = [...stockMovementData].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id,
  );

  return (
    <div
      style={{
        border: '2px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#212121',
        padding: '20px',
        marginBlock: '30px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '18px',
          fontWeight: 500,
          marginBottom: '12px',
        }}
      >
        Stock History
        <StockChangeComponent
          partId={partId}
          stockLevel={stockLevel}
          onChanged={() => {
            refetch(); // the history table below
            onStockChanged?.(); // the part's stock level on the page
          }}
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
      {!loading && !error && movements.length === 0 && (
        <div>No stock changes yet.</div>
      )}

      {movements.length > 0 && (
        <div style={{ maxHeight: '320px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCell}>Date</th>
                <th style={headerCell}>Changed By</th>
                <th style={{ ...headerCell, textAlign: 'right' }}>Change</th>
                <th style={{ ...headerCell, textAlign: 'right' }}>
                  Resulting Stock
                </th>
                <th style={headerCell}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                    {formatDate(movement.createdAt)}
                  </td>
                  <td style={cell}>{movement.userName ?? 'System'}</td>
                  <td
                    style={{
                      ...cell,
                      textAlign: 'right',
                      fontWeight: 600,
                      color: movement.delta > 0 ? '#5fd38d' : '#ff6b6b',
                    }}
                  >
                    {formatDelta(movement.delta)}
                  </td>
                  <td style={{ ...cell, textAlign: 'right' }}>
                    {movement.stockLevelAfter}
                  </td>
                  <td style={cell}>{movement.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
