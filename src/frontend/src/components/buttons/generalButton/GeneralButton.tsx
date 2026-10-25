interface GeneralButtonProps {
  onClick?: () => void;
  buttonText: string;
  type?: 'button' | 'submit'; // defaults to 'button' so it never submits a form by accident
  form?: string; // id of a <form> to submit when this button sits outside of it
  disabled?: boolean;
}

export function GeneralButton({
  onClick,
  buttonText,
  type = 'button',
  form,
  disabled,
}: GeneralButtonProps) {
  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      style={{
        whiteSpace: 'nowrap',
        backgroundColor: '#3a0e03',
        color: 'white',
        border: '1px solid #a3a3a3',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 550,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4e0909')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3a0e03')}
      onClick={() => onClick?.()}
    >
      {buttonText}
    </button>
  );
}
