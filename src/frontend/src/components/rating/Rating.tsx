import { useTheme } from '../../hooks/userSettings/useTheme';

export interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  const themeType = useTheme();
  const filled = '★'.repeat(value);
  const empty = '☆'.repeat(5 - value);

  function colorValue() {
    if (value <= 2) {
      return themeType.successTextColor;
    }
    if (value > 2 && value < 4) {
      return themeType.warningTextColor;
    }
    if (value >= 4) {
      return themeType.errorTextColor;
    }
    return themeType.textPrimaryColor;
  }
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div
        style={{
          backgroundColor: themeType.surfaceHoverColor,
          border: `1px solid ${themeType.borderColor}`,
          borderRadius: '20px',
          fontSize: '20px',
          fontWeight: 500,
          color: colorValue(),
          padding: '8px',
        }}
      >
        {filled + empty}
      </div>
      <div>{`(${value})`}</div>
    </span>
  );
}
