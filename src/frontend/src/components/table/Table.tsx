import { useContext } from 'react';
import { ThemeContext } from '../../settings/themeStyling/ThemeProvider';

export interface TableProps {
  children: React.ReactNode;
  labels: string[];
}
export const partTableGrid = '2fr 2fr 2fr .55fr .8fr .8fr';

export const overflowSectionStyle = {
  paddingInline: '2%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

export function Table({ children, labels }: TableProps) {
  const { themeType } = useContext(ThemeContext)!;
  return (
    <div
      style={{
        backgroundColor: themeType.surfaceColor,
        border: `1px solid ${themeType.borderColor}`,
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '100%',
        color: themeType.textPrimaryColor,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '-1px',
        }}
      >
        <thead>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: partTableGrid,
              borderBottom: `1px solid ${themeType.borderColor}`,
            }}
          >
            {labels.map((label, index) => (
              <th
                key={`${label}-${index}`}
                style={{
                  textAlign: 'left',
                  padding: '12px 2%',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: themeType.textFaintColor,
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
