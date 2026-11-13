import { useState } from 'react';
import { useAdjustStock } from '../../hooks/stockMovements/useAdjustStock';
import { useToast } from '../toast/ToastProvider';
import { Modal } from '../modal/Modal';
import { GeneralButton } from '../buttons/generalButton/GeneralButton';
import { CancelButton } from '../buttons/cancelButton/CancelButton';
import { PreviewAdjustStockResult } from '../../schemas/stockMovements/stockMovements.schema';
import { useTheme } from '../../hooks/userSettings/useTheme';

export interface StockChangeComponentProps {
  partId: number;
  stockLevel: number;
  // Called after the stock was changed, so the parent can refresh what it shows
  onChanged?: () => void;
}

export function StockChangeComponent({
  partId,
  stockLevel,
  onChanged,
}: StockChangeComponentProps) {
  const themeType = useTheme();
  const [stockAmount, setStockAmount] = useState('1');
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  // Set when adding would take the part off the low stock list: shows the confirm modal
  const [confirmRemoval, setConfirmRemoval] =
    useState<PreviewAdjustStockResult | null>(null);
  const { adjustStock, previewStock, loading, error } = useAdjustStock();
  const { showToast } = useToast();

  const amount = Number(stockAmount);
  const validAmount = Number.isInteger(amount) && amount >= 1;

  // Adding has no upper limit. Removing can't take more than what's in stock.
  const canAdd = validAmount && !loading;
  const canRemove = validAmount && amount <= stockLevel && !loading;

  // direction: 1 = add stock, -1 = remove stock
  // removesFromLowStock: the user confirmed this add takes the part off the low stock list
  const handleChange = async (
    direction: 1 | -1,
    removesFromLowStock = false,
  ) => {
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
    showToast(
      direction === 1
        ? `Added ${amount} to stock${removesFromLowStock ? ' - removed from the low stock list' : ''}`
        : `Removed ${amount} from stock`,
    );
    if (result.lowStockEventId !== null) {
      setNotice(
        `Below minimum stock (${result.minStockLevel}) - this part is on the low stock list.`,
      );
    }
    onChanged?.();
  };

  // Add button: first ask the backend whether this would take the part off the low
  // stock list. If it would, show the confirm modal; if not, just add the stock.
  // If the check itself fails, nothing is changed and the hook's error is shown.
  const handleAddClick = async () => {
    setNotice(null);
    const preview = await previewStock(partId, amount);
    if (!preview) return;

    if (preview.willClearLowStock) {
      setConfirmRemoval(preview);
      return;
    }
    await handleChange(1);
  };

  // "Add Stock" in the modal. The modal closes either way; if the add failed the
  // error shows under the buttons and what they typed is kept.
  const handleConfirmAdd = async () => {
    await handleChange(1, true);
    setConfirmRemoval(null);
  };

  const hover = (enabled: boolean, color: string) => (e: React.MouseEvent) => {
    if (enabled) (e.currentTarget as HTMLElement).style.backgroundColor = color;
  };
  const inputStyle: React.CSSProperties = {
    backgroundColor: themeType.compactInputBackgroundColor,
    color: themeType.compactInputTextColor,
    border: `1px solid ${themeType.compactInputBorderColor}`,
    borderRadius: '7px',
    padding: '6px 8px',
    fontSize: '12px',
    boxSizing: 'border-box',
  };
  const actionButtonStyle = (
    enabled: boolean,
    color: string,
  ): React.CSSProperties => ({
    backgroundColor: color,
    color: themeType.buttonTextColor,
    border: `1px solid ${themeType.buttonBorderColor}`,
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 550,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.45,
    whiteSpace: 'nowrap',
  });

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
      <div style={{ fontSize: '12px', color: themeType.textMutedColor }}>
        Adjust Stock
      </div>

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
          style={actionButtonStyle(canRemove, themeType.buttonBackgroundColor)}
          onMouseEnter={hover(
            canRemove,
            themeType.buttonHoverBackgroundColor,
          )}
          onMouseLeave={hover(canRemove, themeType.buttonBackgroundColor)}
          onClick={() => handleChange(-1)}
        >
          − Remove
        </button>
        <button
          disabled={!canAdd}
          style={actionButtonStyle(
            canAdd,
            themeType.successButtonBackgroundColor,
          )}
          onMouseEnter={hover(
            canAdd,
            themeType.successButtonHoverBackgroundColor,
          )}
          onMouseLeave={hover(
            canAdd,
            themeType.successButtonBackgroundColor,
          )}
          onClick={handleAddClick}
        >
          + Add
        </button>
        {loading && (
          <span style={{ fontSize: '12px', color: themeType.textMutedColor }}>
            Saving...
          </span>
        )}
      </div>

      {/* Feedback: what will happen / what went wrong / what happened */}
      {preview && !loading && !error && (
        <div style={{ fontSize: '11px', color: themeType.textMutedColor }}>
          Current stock: {stockLevel}  ·  {preview}
        </div>
      )}
      {error && (
        <div
          role="alert"
          style={{ fontSize: '12px', color: themeType.errorTextColor }}
        >
          {error}
        </div>
      )}
      {notice && !error && (
        <div
          role="status"
          style={{ fontSize: '12px', color: themeType.warningTextColor }}
        >
          {notice}
        </div>
      )}

      {confirmRemoval && (
        <Modal
          modalTitle="Add Stock"
          onClose={() => setConfirmRemoval(null)}
          footer={
            <>
              <CancelButton onClick={() => setConfirmRemoval(null)} />
              <GeneralButton
                buttonText={loading ? 'Adding...' : 'Add Stock'}
                onClick={handleConfirmAdd}
                disabled={loading}
              />
            </>
          }
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            Are you sure you want to add stock? Adding{' '}
            <strong>{amount}</strong> brings this part to{' '}
            <strong>{confirmRemoval.newStockLevel}</strong>, which is at or above
            its minimum of {confirmRemoval.minStockLevel}. It will be removed
            from the low stock list.
          </p>
        </Modal>
      )}
    </div>
  );
}
