import { NavLink } from 'react-router';

export function PartsHeaderOptions() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#ffffff' : '#b0b0b0',
    fontWeight: isActive ? 700 : 400,
    cursor: 'pointer',
    textDecoration: 'none',
    borderBottom: isActive ? '2px solid white' : '',
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
        <NavLink to="/parts/unordered" style={linkStyle}>
          Low Stock
        </NavLink>

        <NavLink to="/parts/ordered" style={linkStyle}>
          Ordered
        </NavLink>
      </div>
    </>
  );
}
