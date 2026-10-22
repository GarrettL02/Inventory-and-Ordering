import { useRouteError } from 'react-router-dom';
import { BackButton } from '../buttons/backButton/BackButton';

export function ErrorPage() {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
  };

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#2e2e2e',
        color: '#fff',
        minHeight: '100dvh',
      }}
    >
      <h1>Oops! {error?.status ?? 'Error'}</h1>
      <p>{error?.statusText || error?.message || 'Something went wrong.'}</p>
      <BackButton />
    </div>
  );
}
