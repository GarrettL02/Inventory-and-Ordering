import { useFetchPartValuation } from '../../hooks/parts/useFetchPartValuation';
import { HomeCard, homeCardMessageStyle } from './HomeCard';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// totalValuation arrives as a string, so guard against missing/invalid values
function formatCurrency(value?: string | null): string {
  const parsed = Number(value);
  return value == null || Number.isNaN(parsed)
    ? '—'
    : currencyFormatter.format(parsed);
}

interface StatProps {
  label: string;
  value: string;
  note?: string;
  muted?: boolean;
}

function Stat({ label, value, note, muted }: StatProps) {
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#8a8a8a',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: 600,
          marginTop: '6px',
          color: muted ? '#6b6b6b' : '#ffffff',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {note && (
        <div style={{ fontSize: '12px', color: '#a7a7a7', marginTop: '4px' }}>
          {note}
        </div>
      )}
    </div>
  );
}

export function InventoryValuationComponent() {
  const { partValue, loading, error } = useFetchPartValuation();

  return (
    <HomeCard title="Inventory Valuation">
      {loading && <p style={homeCardMessageStyle}>Loading...</p>}
      {error && !loading && (
        <p style={{ ...homeCardMessageStyle, color: '#ef5350' }}>{error}</p>
      )}
      {!loading && !error && (
        <>
          <Stat
            label="Inventory parts"
            value={formatCurrency(partValue?.totalValuation)}
            note="Stock level × average price"
          />
          <div style={{ borderTop: '1px solid #2e2e2e' }}>
            <Stat
              label="Assets"
              value="—"
              note="Not tracked yet"
              muted
            />
          </div>
        </>
      )}
    </HomeCard>
  );
}
