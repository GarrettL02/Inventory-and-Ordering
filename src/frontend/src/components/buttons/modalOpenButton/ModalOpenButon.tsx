import { useState } from 'react';
import { useTheme } from '../../../hooks/userSettings/useTheme';

interface ModalOpenButtonProps {
  modalInfoComponent: React.ReactNode;
  buttonText: string;
}

export function ModalOpenButton({
  buttonText,
  modalInfoComponent,
}: ModalOpenButtonProps) {
  const themeType = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        style={{
          backgroundColor: themeType.buttonBackgroundColor,
          color: themeType.buttonTextColor,
          border: `1px solid ${themeType.buttonBorderColor}`,
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '12px',
          fontWeight: 550,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            themeType.buttonHoverBackgroundColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor =
            themeType.buttonBackgroundColor)
        }
      >
        {buttonText}
      </button>
      {modalOpen && modalInfoComponent}
    </>
  );
}
