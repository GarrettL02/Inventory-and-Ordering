export interface RatingProps {
  value: number;
}

export function Rating({ value }: RatingProps) {
  const filled = '★'.repeat(value);
  const empty = '☆'.repeat(5 - value);

  function colorValue() {
    if (value <= 2) {
      return '#044f00f2';
    }
    if (value > 2 && value < 4) {
      return '#948d06f8';
    }
    if (value >= 4) {
      return '#830202f2';
    }
    return 'white';
  }
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div
        style={{
          backgroundColor: '#2e2e2e',
          border: '1px solid #1a1a1a',
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
