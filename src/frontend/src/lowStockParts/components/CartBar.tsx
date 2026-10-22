interface CartBarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function CartBar({ isExpanded, onToggle }: CartBarProps) {
  return (
    <div
      data-testid="cart-bar-panel"
      style={{
        backgroundColor: '#212121ff',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        width: isExpanded ? '32%' : '12%',
        transition: 'width 0.3s ease',
        boxSizing: 'border-box',
        borderLeft: '1px solid #3d3d3d',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '50px 20px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            gap: '10px',
          }}
        >
          <button
            style={{
              color: '#ffffff',
              alignSelf: 'flex-start',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#303030',
              padding: '5px',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isExpanded ? 'rotate(-270deg)' : 'rotate(-90deg)',
            }}
            onClick={onToggle}
            aria-expanded={isExpanded}
          >
            ⮝
          </button>
          <div
            style={{ display: 'flex', alignItems: 'center', color: '#717171' }}
          >
            {isExpanded ? 'Close' : 'Open'}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: isExpanded ? '23px' : '17px',
              transition: 'font-size 0.3s ease',
            }}
          >
            Current Cart
          </div>
          <div style={{ color: '#580909ff', fontWeight: 700 }}>_________</div>
        </div>
      </div>
    </div>
  );
}
