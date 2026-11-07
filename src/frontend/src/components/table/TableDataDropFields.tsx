interface TableDataDropFieldsProps {
  label: string;
  value: React.ReactNode;
}

export function TableDataDropFields({
  label,
  value,
}: TableDataDropFieldsProps) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#8a8a8a',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: '14px', color: '#cfcfcf', overflowWrap: 'anywhere' }}
      >
        {value === null ? 'N/A' : value}
      </div>
    </div>
  );
}
