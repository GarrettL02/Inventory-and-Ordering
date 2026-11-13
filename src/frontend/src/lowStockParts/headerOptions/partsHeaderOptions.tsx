import { NavLink } from 'react-router';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function PartsHeaderOptions() {
  const themeType = useTheme();
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive
      ? themeType.textPrimaryColor
      : themeType.textMutedColor,
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    textDecoration: 'none',
    borderBottom: isActive ? `2px solid ${themeType.accentColor}` : '',
    paddingBottom: '20px',
    paddingTop: '20px',
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 80,
          marginInline: '100px',
        }}
      >
        <NavLink to="/lowstock" style={linkStyle}>
          Low Stock
        </NavLink>

        <NavLink to="/ordered" style={linkStyle}>
          Ordered
        </NavLink>
      </div>
    </>
  );
}
