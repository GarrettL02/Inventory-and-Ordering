import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTheme } from '../../hooks/userSettings/useTheme';

type ToastKind = 'success' | 'error';

interface ToastProps {
  id: number;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const themeType = useTheme();
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, kind }]);

      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
      timers.current.push(timer);
    },
    [],
  );

  // Clear any pending timers if the provider ever unmounts
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <style>{`
        @keyframes toast-in-out {
          0%   { opacity: 0; transform: translateY(8px); }
          10%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
      `}</style>
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              backgroundColor:
                t.kind === 'success'
                  ? themeType.toastSuccessBackgroundColor
                  : themeType.toastErrorBackgroundColor,
              color: themeType.buttonTextColor,
              border: `1px solid ${themeType.borderStrongColor}`,
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 550,
              whiteSpace: 'nowrap',
              animation: `toast-in-out ${TOAST_DURATION_MS}ms ease forwards`,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}