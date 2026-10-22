interface ReadOnlyInfoSectionProps {
  title: string;
  information: React.ReactNode;
}

export function ReadOnlyInfoSection({
  title,
  information,
}: ReadOnlyInfoSectionProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      <div style={{ fontWeight: 300, marginBottom: '6px' }}>{title}</div>
      <div style={{ color: '#bbb9b9' }}>{information || 'N/A'}</div>
    </div>
  );
}
