interface GeneralButtonProps {
  onClick: () => void;
  buttonText: string;
}

export function GeneralButton({ onClick, buttonText }: GeneralButtonProps) {
  return (
    <button
      style={{
        whiteSpace: 'nowrap',
        backgroundColor: '#3a0e03',
        color: 'white',
        border: '1px solid #a3a3a3',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 550,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4e0909')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3a0e03')}
      onClick={() => onClick()}
    >
      {buttonText}
    </button>
  );
}
