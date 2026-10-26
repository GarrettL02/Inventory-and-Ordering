import { useState } from 'react';
import { useAdjustStock } from '../../hooks/stockMovements/useAdjustStock';

export interface StockChangeComponentProps {
  partId: number;
  stockLevel: number;
  // Called after the stock was changed, so the parent can refresh what it shows
  onChanged?: () => void;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#161616',
  color: 'white',
  border: '1px solid #a3a3a3',
  borderRadius: '7px',
  padding: '6px 8px',
  fontSize: '12px',
  boxSizing: 'border-box',
};

// Remove = the red-brown used on the other buttons, Add = a matching dark green
const actionButtonStyle = (
  enabled: boolean,
  color: string,
): React.CSSProperties => ({
  backgroundColor: color,
  color: 'white',
  border: '1px solid #a3a3a3',
  borderRadius: '8px',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: 550,
  cursor: enabled ? 'pointer' : 'not-allowed',
  opacity: enabled ? 1 : 0.45,
  whiteSpace: 'nowrap',
});

export function StockChangeComponent({
  partId,
  stockLevel,
  onChanged,
}: StockChangeComponentProps) {
  const [stockAmount, setStockAmount] = useState('1');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const { adjustStock, loading, error } = useAdjustStock();

  const amount = Number(stockAmount);
  const validAmount = Number.isInteger(amount) && amount >= 1;

  // Adding has no upper limit. Removing can't take more than what's in stock.
  const canAdd = validAmount && !loading;
  const canRemove = validAmount && amount <= stockLevel && !loading;

  // direction: 1 = add stock, -1 = remove stock
  const handleChange = async (direction: 1 | -1) => {
    setNotice(null);
    const result = await adjustStock(
      partId,
      direction * amount,
      reason.trim() || undefined,
    );
    // null means it failed - keep what they typed, the hook has the error message
    if (!result) return;

    setStockAmount('1');
    setReason('');
    if (result.lowStockEventId !== null) {
      setNotice(
        `Below minimum stock (${result.minStockLevel}) - this part is on the low stock list.`,
      );
    }
    onChanged?.();
  };

  const hover = (enabled: boolean, color: string) => (e: React.MouseEvent) => {
    if (enabled) (e.currentTarget as HTMLElement).style.backgroundColor = color;
  };

  // One short line that says what each button would do
  let preview: string | null = null;
  if (validAmount) {
    preview =
      amount <= stockLevel
        ? `Remove → ${stockLevel - amount}  ·  Add → ${stockLevel + amount}`
        : `Can't remove ${amount}  ·  Add → ${stockLevel + amount}`;
  }

  return (
    <div
      style={{
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '12px', color: '#a7a7a7' }}>Adjust Stock</div>

      {/* Row 1: how many, and why (optional) */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          aria-label="Amount"
          type="number"
          min={1}
          step={1}
          style={{ ...inputStyle, width: '64px' }}
          value={stockAmount}
          onChange={(e) => setStockAmount(e.target.value)}
          onBlur={() => {
            // If they clear it or type something invalid, snap back to 1
            if (!validAmount) setStockAmount('1');
          }}
        />
        <input
          aria-label="Reason (optional)"
          placeholder="Reason (optional), e.g. used on job"
          maxLength={64}
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Row 2: the two actions */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          disabled={!canRemove}
          style={actionButtonStyle(canRemove, '#3a0e03')}
          onMouseEnter={hover(canRemove, '#4e0909')}
          onMouseLeave={hover(canRemove, '#3a0e03')}
          onClick={() => handleChange(-1)}
        >
          − Remove
        </button>
        <button
          disabled={!canAdd}
          style={actionButtonStyle(canAdd, '#103a22')}
          onMouseEnter={hover(canAdd, '#16502f')}
          onMouseLeave={hover(canAdd, '#103a22')}
          onClick={() => handleChange(1)}
        >
          + Add
        </button>
        {loading && (
          <span style={{ fontSize: '12px', color: '#a7a7a7' }}>Saving...</span>
        )}
      </div>

      {/* Feedback: what will happen / what went wrong / what happened */}
      {preview && !loading && !error && (
        <div style={{ fontSize: '11px', color: '#a7a7a7' }}>
          Current stock: {stockLevel}  ·  {preview}
        </div>
      )}
      {error && (
        <div role="alert" style={{ fontSize: '12px', color: '#ff6b6b' }}>
          {error}
        </div>
      )}
      {notice && !error && (
        <div role="status" style={{ fontSize: '12px', color: '#e0b04a' }}>
          {notice}
        </div>
      )}
    </div>
  );
}
