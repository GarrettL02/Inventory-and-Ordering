import { useTheme } from '../../hooks/userSettings/useTheme';

interface ReadOnlyInfoSectionProps {
  title: string;
  information: React.ReactNode;
}

export function ReadOnlyInfoSection({
  title,
  information,
}: ReadOnlyInfoSectionProps) {
  const themeType = useTheme();
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      <div style={{ fontWeight: 300, marginBottom: '6px' }}>{title}</div>
      <div style={{ color: themeType.textSecondaryColor }}>
        {information || 'N/A'}
      </div>
    </div>
  );
}
