import { StockChangeComponent } from '../../components/stockChange/StockChangeComponent';
import { useFetchStockMovements } from '../../hooks/stockMovements/useFetchStockMovements';
import { useTheme } from '../../hooks/userSettings/useTheme';
import { ThemeColors } from '../../settings/themeStyling/themeStyling';

interface StockHistorySectionProps {
  partId: number;
  stockLevel: number;
  // Called after the stock was changed, so the page can refresh the part's stock level
  onStockChanged?: () => void;
}

const headerCell = (themeType: ThemeColors): React.CSSProperties => ({
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: themeType.textMutedColor,
  borderBottom: `1px solid ${themeType.borderStrongColor}`,
  position: 'sticky',
  top: 0,
  backgroundColor: themeType.panelBackgroundColor,
  whiteSpace: 'nowrap',
});

const cell = (themeType: ThemeColors): React.CSSProperties => ({
  padding: '8px 12px',
  fontSize: '13px',
  borderBottom: `1px solid ${themeType.borderColor}`,
});

// +5 / -2 (a negative number already has its minus sign)
const formatDelta = (delta: number) => (delta > 0 ? `+${delta}` : `${delta}`);

const formatDate = (date: Date) =>
  date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function StockHistorySection({
  partId,
  stockLevel,
  onStockChanged,
}: StockHistorySectionProps) {
  const themeType = useTheme();
  const { stockMovementData, loading, error, refetch } =
    useFetchStockMovements(partId);

  // Newest first (the backend doesn't guarantee an order)
  const movements = [...stockMovementData].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id,
  );

  return (
    // Wrapper takes part in the grid layout but contributes only a minimum
    // height, so the neighbouring column decides how tall the row is
    <div
      style={{
        position: 'relative',
        minHeight: '400px',
        marginBlock: '30px',
      }}
    >
      {/* Inner box fills the wrapper exactly; only the table scrolls inside it */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${themeType.panelBorderColor}`,
          borderRadius: '10px',
          backgroundColor: themeType.panelBackgroundColor,
          color: themeType.textPrimaryColor,
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: 500,
            marginBottom: '12px',
            flexShrink: 0,
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
        {error && (
          <div style={{ color: themeType.errorTextColor }}>{error}</div>
        )}
        {!loading && !error && movements.length === 0 && (
          <div>No stock changes yet.</div>
        )}

        {movements.length > 0 && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={headerCell(themeType)}>Date</th>
                  <th style={headerCell(themeType)}>Changed By</th>
                  <th style={{ ...headerCell(themeType), textAlign: 'right' }}>
                    Change
                  </th>
                  <th style={{ ...headerCell(themeType), textAlign: 'right' }}>
                    Resulting Stock
                  </th>
                  <th style={headerCell(themeType)}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td style={cell(themeType)}>
                      {formatDate(movement.createdAt)}
                    </td>
                    <td style={cell(themeType)}>
                      {movement.userName ?? 'System'}
                    </td>
                    <td
                      style={{
                        ...cell(themeType),
                        textAlign: 'right',
                        fontWeight: 600,
                        color:
                          movement.delta > 0
                            ? themeType.successTextColor
                            : themeType.errorTextColor,
                      }}
                    >
                      {formatDelta(movement.delta)}
                    </td>
                    <td style={{ ...cell(themeType), textAlign: 'right' }}>
                      {movement.stockLevelAfter}
                    </td>
                    {/* Date and reason can wrap; the other columns stay on one line */}
                    <td
                      style={{
                        ...cell(themeType),
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {movement.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
