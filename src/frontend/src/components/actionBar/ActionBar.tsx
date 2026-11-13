import { useTheme } from '../../hooks/userSettings/useTheme';

interface ActionBarProps {
  actions: React.ReactNode;
}
export function ActionBar({ actions }: ActionBarProps) {
  const themeType = useTheme();
  return (
    <div
      style={{
        backgroundColor: themeType.surfaceColor,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        height: '70px',
        borderTop: `2px solid ${themeType.borderColor}`,
      }}
    >
      <div
        style={{
          position: 'fixed',
          right: 0,
          display: 'flex',
          alignItems: 'center',
          height: '70px',
          paddingRight: '30px',
        }}
      >
        {actions}
      </div>
    </div>
  );
}
