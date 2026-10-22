import { useNavigate } from 'react-router';

export function BackButton() {
  const nav = useNavigate();

  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: '#a7a7a7',
        cursor: 'pointer',
        fontSize: '17px',
      }}
      onClick={() => nav(-1)}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#4e0909')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#a7a7a7')}
    >
      ← Back
    </button>
  );
}
