import { useFetchPartValuation } from '../../hooks/parts/useFetchPartValuation';
import { HomeCard, homeCardMessageStyle } from './HomeCard';
import { useTheme } from '../../hooks/userSettings/useTheme';

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
  const themeType = useTheme();
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: themeType.textFaintColor,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: 600,
          marginTop: '6px',
          color: muted
            ? themeType.textMutedColor
            : themeType.textPrimaryColor,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {note && (
        <div
          style={{
            fontSize: '12px',
            color: themeType.textMutedColor,
            marginTop: '4px',
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}

export function InventoryValuationComponent() {
  const themeType = useTheme();
  const { partValue, loading, error } = useFetchPartValuation();

  return (
    <HomeCard title="Inventory Valuation">
      {loading && <p style={homeCardMessageStyle}>Loading...</p>}
      {error && !loading && (
        <p
          style={{ ...homeCardMessageStyle, color: themeType.errorTextColor }}
        >
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <Stat
            label="Inventory parts"
            value={formatCurrency(partValue?.totalValuation)}
            note="Stock level × average price"
          />
          <div
            style={{ borderTop: `1px solid ${themeType.borderSubtleColor}` }}
          >
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
