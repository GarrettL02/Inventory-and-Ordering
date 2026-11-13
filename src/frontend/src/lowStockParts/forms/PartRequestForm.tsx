import { useEffect } from 'react';
import { BackButton } from '../../components/buttons/backButton/BackButton';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function PartRequestForm() {
  const themeType = useTheme();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        backgroundColor: themeType.backgroundColor,
        color: themeType.textPrimaryColor,
        width: '100%',
        minHeight: '100dvh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <BackButton />
      </div>

      <div>Loading part data...</div>
    </div>
  );
}
