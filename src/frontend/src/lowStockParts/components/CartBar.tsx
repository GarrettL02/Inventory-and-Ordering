import { useState } from 'react';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface CartBarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function CartBar({ isExpanded, onToggle }: CartBarProps) {
  const themeType = useTheme();
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  return (
    <div
      data-testid="cart-bar-panel"
      style={{
        backgroundColor: themeType.sidebarBackgroundColor,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        width: isExpanded ? '32%' : '12%',
        boxSizing: 'border-box',
        borderLeft: `1px solid ${themeType.sidebarBorderColor}`,
        boxShadow: isExpanded
          ? `-8px 0 24px ${themeType.shadowColor}`
          : 'none',
        transition: 'width 0.3s ease, box-shadow 0.3s ease',
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
            marginBottom: '16px',
            gap: '10px',
          }}
        >
          <button
            style={{
              color: isToggleHovered
                ? themeType.textPrimaryColor
                : themeType.textSecondaryColor,
              alignSelf: 'flex-start',
              border: `1px solid ${themeType.sidebarBorderColor}`,
              borderRadius: '8px',
              backgroundColor: isToggleHovered
                ? themeType.activeOverlayColor
                : themeType.hoverOverlayColor,
              padding: '5px 8px',
              cursor: 'pointer',
              fontSize: '15px',
              lineHeight: 1,
              transition:
                'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s ease, color 0.15s ease',
              transform: isExpanded ? 'rotate(-270deg)' : 'rotate(-90deg)',
            }}
            onClick={onToggle}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            aria-expanded={isExpanded}
          >
            ⮝
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: themeType.sidebarTextColor,
              fontSize: '13px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {isExpanded ? 'Close' : 'Open'}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: isExpanded ? '23px' : '17px',
              fontWeight: 600,
              color: themeType.textPrimaryColor,
              transition: 'font-size 0.3s ease',
            }}
          >
            Current Cart
          </div>
          <div
            style={{
              width: '40px',
              height: '3px',
              marginTop: '8px',
              borderRadius: '3px',
              backgroundColor: themeType.accentColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}
