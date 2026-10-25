import { useEffect } from 'react';

export interface ModalProps {
  modalTitle: string;
  children: React.ReactNode;
  /** When provided, enables the X button, Escape key and backdrop-click to close. */
  onClose?: () => void;
  /** Pinned below the scrolling body, so action buttons are always visible. */
  footer?: React.ReactNode;
}

export function Modal({ modalTitle, children, onClose, footer }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!onClose) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Lock page scroll while the modal is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      onMouseDown={(e) => {
        // Only close when the backdrop itself is clicked, not the panel
        if (onClose && e.target === e.currentTarget) onClose();
      }}
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
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #303030 100%)',
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0 }}>{modalTitle}</h2>
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#a7a7a7',
                cursor: 'pointer',
                fontSize: '22px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
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
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '12px',
              borderTop: '1px solid #4a4a4a',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
