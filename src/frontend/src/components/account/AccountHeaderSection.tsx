import { useAuth } from '../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function AccountHeaderSection() {
  const themeType = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login', { replace: true });
  };

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 2,
        right: window.innerWidth - rect.right,
        backgroundColor: themeType.menuBackgroundColor,
        border: `1px solid ${themeType.menuBorderColor}`,
        borderRadius: '4px',
        boxShadow: `0 2px 8px ${themeType.shadowColor}`,
        zIndex: 9999,
        minWidth: '150px',
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          backgroundColor: themeType.accountChipBackgroundColor,
          paddingInline: '20px',
          paddingBlock: '8px',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            themeType.accountChipHoverBackgroundColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor =
            themeType.accountChipBackgroundColor)
        }
      >
        <div
          style={{
            border: 'none',
            borderRadius: '25px',
            width: '30px',
            height: '30px',
            backgroundColor: themeType.avatarBackgroundColor,
            boxShadow: `0 2px 4px ${themeType.shadowColor}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: themeType.buttonTextColor,
            fontWeight: 'bold',
          }}
        >
          {user?.username.charAt(0)}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <span>{user?.username || 'Guest'}</span>
        </div>
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div style={menuStyle} onMouseDown={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                handleLogout();
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: themeType.textPrimaryColor,
                fontWeight: 'normal',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  themeType.hoverOverlayColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              Sign Out
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
