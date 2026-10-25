import { useState } from 'react';

interface ModalOpenButtonProps {
  modalInfoComponent: React.ReactNode;
  buttonText: string;
}

export function ModalOpenButton({
  buttonText,
  modalInfoComponent,
}: ModalOpenButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
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
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#4e0909')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#3a0e03')
        }
      >
        {buttonText}
      </button>
      {modalOpen && modalInfoComponent}
    </>
  );
}
