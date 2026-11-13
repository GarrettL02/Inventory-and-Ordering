import { useContext } from 'react';
import { ThemeContext } from '../../hooks/userSettings/useTheme';

export function Chip() {
  const { themeType } = useContext(ThemeContext)!;

  return (
    <div
      style={{
        backgroundColor: themeType.surfaceHoverColor,
        border: `1px solid ${themeType.borderColor}`,
        borderRadius: '10px',
        color: themeType.textSecondaryColor,
        padding: '5px',
        fontSize: '10px',
      }}
    >
      Partkeepr
    </div>
  );
}