interface ReadOnlyInfoSectionProps {
  title: string;
  information: React.ReactNode;
}

export function ReadOnlyInfoSection({
  title,
  information,
}: ReadOnlyInfoSectionProps) {
  // 0 is a real value (e.g. stock level), so only empty values show N/A
  const isEmpty =
    information === undefined || information === null || information === '';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minWidth: 0 }}>
      <div
        style={{
          color: '#a7a7a7',
          fontSize: '12px',
          fontWeight: 500,
          marginBottom: '6px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: '#eaeaea',
          fontSize: '14px',
          lineHeight: 1.45,
          overflowWrap: 'anywhere',
        }}
      >
        {isEmpty ? <span style={{ color: '#6f6f6f' }}>N/A</span> : information}
      </div>
    </div>
  );
}
