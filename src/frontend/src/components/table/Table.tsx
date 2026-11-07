export interface TableProps {
  children: React.ReactNode;
  labels: string[];
  tableType: 'part';
}
export const partTableGrid = '2fr 2fr 2fr .55fr .8fr .8fr';

export const overflowSectionStyle = {
  paddingInline: '2%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

export function Table({ children, labels, tableType }: TableProps) {
  return (
    // Same card look as the homepage panels (see home/components/HomeCard)
    <div
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          // Hides the last row's divider so it doesn't double up with the card border
          marginBottom: '-1px',
        }}
      >
        <thead>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: partTableGrid,
              borderBottom: '1px solid #333333',
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
                  color: '#8a8a8a',
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
