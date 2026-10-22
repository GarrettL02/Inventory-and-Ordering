import { useEffect } from 'react';
import { BackButton } from '../../components/buttons/backButton/BackButton';

export function PartRequestForm() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#2e2e2e',
        color: '#ffffff',
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
