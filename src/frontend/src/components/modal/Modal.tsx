import { BackButton } from '../buttons/backButton/BackButton';

export interface ModalProps {
  modalTitle: string;
  children: React.ReactNode;
}

export function Modal({ modalTitle, children }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1edc',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 1000,
          backgroundColor: 'linear-gradient(135deg, #1e1e1e 0%, #303030 100%)',
          minHeight: '100px',
          minWidth: '50%',
          maxWidth: '90%',
          maxHeight: '90vh',
          boxSizing: 'border-box',
          padding: '20px',
          boxShadow: '0 8px 40px #0000004d',
          borderRadius: '12px',
          gap: '20px',
        }}
      >
        <h2>{modalTitle}</h2>
        <div
          style={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
