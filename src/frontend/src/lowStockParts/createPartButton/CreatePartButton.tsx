import { useNavigate } from 'react-router-dom';

export function CreatePartButton() {
  const nav = useNavigate();

  return (
    <button
      style={{
        backgroundColor: '#3a0e03',
        color: 'white',
        border: '1px solid #bdbdbd',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '12px',
        fontWeight: 550,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4e0909')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3a0e03')}
      onClick={() => nav('/parts/partRequest')}
    >
      Add Part Request
    </button>
  );
}
