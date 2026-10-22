interface ActionBarProps {
  actions: React.ReactNode;
}
export function ActionBar({ actions }: ActionBarProps) {
  return (
    <div
      style={{
        backgroundColor: 'rgb(20, 20, 20)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        height: '70px',
        borderTop: '2px solid #333',
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
