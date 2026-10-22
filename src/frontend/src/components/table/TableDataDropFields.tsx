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
      <div style={{ fontSize: '12px', fontWeight: 300, marginBottom: '4px' }}>
        {label}
      </div>
      <div
        style={{ fontSize: '14px', color: '#bbb9b9', overflowWrap: 'anywhere' }}
      >
        {value === null ? 'N/A' : value}
      </div>
    </div>
  );
}
