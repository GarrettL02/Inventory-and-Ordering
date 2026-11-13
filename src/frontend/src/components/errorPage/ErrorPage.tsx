import { useRouteError } from 'react-router-dom';
import { BackButton } from '../buttons/backButton/BackButton';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function ErrorPage() {
  const themeType = useTheme();
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
        backgroundColor: themeType.backgroundColor,
        color: themeType.textPrimaryColor,
        minHeight: '100dvh',
      }}
    >
      <h1>Oops! {error?.status ?? 'Error'}</h1>
      <p>{error?.statusText || error?.message || 'Something went wrong.'}</p>
      <BackButton />
    </div>
  );
}
