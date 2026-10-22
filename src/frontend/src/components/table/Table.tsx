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
    <div
      style={{
        backgroundColor: '#181818ff',
        paddingBlock: '6px',
        overflowX: 'hidden',
        maxWidth: '100%',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#303030ff' }}>
          <tr
            style={{
              display: 'grid',
              gridTemplateColumns: partTableGrid,
              borderBottom: '1px solid #3f3f3f',
            }}
          >
            {labels.map((label) => (
              <th
                key={label}
                style={{
                  textAlign: 'left',
                  padding: '0.3rem',
                  borderLeft: '2px solid #474747ff',
                  fontSize: '12px',
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
