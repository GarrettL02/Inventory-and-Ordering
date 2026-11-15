import { useTheme } from '../../hooks/userSettings/useSettings';

interface ReadOnlyInfoSectionProps {
  title: string;
  information: React.ReactNode;
}

export function ReadOnlyInfoSection({
  title,
  information,
}: ReadOnlyInfoSectionProps) {
  const themeType = useTheme();
  // 0 is a real value (e.g. stock level), so only empty values show N/A
  const isEmpty =
    information === undefined || information === null || information === '';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      <div style={{ fontWeight: 300, marginBottom: '6px' }}>{title}</div>
      <div style={{ color: themeType.textSecondaryColor }}>
        {information || 'N/A'}
      </div>
    </div>
  );
}
