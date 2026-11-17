import { WarningIcon } from '../../../components/icons/WarningIcon';
import { useTheme } from '../../../data/hooks/userSettings/useSettings';

interface CurrentStockComponentProps {
  stockLevel?: number;
  minStockLevel?: number;
}

export function CurrentStockComponent({
  stockLevel,
  minStockLevel,
}: CurrentStockComponentProps) {
  const themeType = useTheme();

  if (stockLevel === undefined || minStockLevel === undefined) {
    return <div>N/A</div>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {stockLevel}{' '}
      {stockLevel < minStockLevel && (
        <span
          style={{
            color: themeType.warningIconColor,
            fontWeight: 'bold',
            marginRight: '6px',
          }}
        >
          <WarningIcon />
        </span>
      )}
    </div>
  );
}
