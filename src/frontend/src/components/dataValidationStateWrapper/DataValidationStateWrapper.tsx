import { BackButton } from '../buttons/backButton/BackButton';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';

interface DataValidationStateWrapperProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}
export function DataValidationStateWrapper({
  error,
  loading,
  children,
}: DataValidationStateWrapperProps) {
  return (
    <>
      {loading && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <BackButton />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80dvh',
              fontSize: '18px',
              gap: '10px',
            }}
          >
            <LoadingSpinner loadingText="Job Details Loading" />
          </div>
        </div>
      )}
      {error && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <BackButton />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80dvh',
              fontSize: '18px',
              gap: '10px',
            }}
          >
            <div>¯\_(ツ)_/¯</div>
            <div>Error loading Job Details: {error}</div>
          </div>
        </div>
      )}
      {!loading && !error && children}
    </>
  );
}
