import { useContext } from 'react';
import { ThemeContext } from '../../settings/themeStyling/ThemeProvider';

interface TableDataDropFieldsProps {
  label: string;
  value: React.ReactNode;
}

export function TableDataDropFields({
  label,
  value,
}: TableDataDropFieldsProps) {
  const { themeType } = useContext(ThemeContext)!;

  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: themeType.textFaintColor,
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: themeType.textSecondaryColor,
          overflowWrap: 'anywhere',
        }}
      >
        {value === null ? 'N/A' : value}
      </div>
    </div>
  );
}
