import { useTheme } from '../../hooks/userSettings/useTheme';

interface LoadingSpinnerProps {
  loadingText: string;
}

export function LoadingSpinner({ loadingText }: LoadingSpinnerProps) {
  const themeType = useTheme();
  return (
    <div>
      <div style={{ margin: 'auto' }}>
        <div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            style={{ animation: 'spin 0.9s linear infinite' }}
          >
            <circle
              cx="24"
              cy="24"
              r="19"
              stroke={themeType.spinnerTrackColor}
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="19"
              stroke={themeType.spinnerHeadColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="34 85"
            />
          </svg>
        </div>
        <div
          style={{
            margin: 'auto',
            fontSize: '14px',
            fontWeight: 600,
            color: themeType.textPrimaryColor,
            letterSpacing: '-0.01em',
          }}
        >
          {loadingText}{' '}
        </div>
      </div>
    </div>
  );
}
