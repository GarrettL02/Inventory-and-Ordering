interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: '#a7a7a7',
        cursor: 'pointer',
        fontSize: '18px',
        marginInline: '20px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#4e0909')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#a7a7a7')}
      onClick={() => onClick()}
    >
      Edit
    </button>
  );
}
