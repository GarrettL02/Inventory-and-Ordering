import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

export function AccountHeaderSection() {
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
        backgroundColor: '#1f1f1f',
        border: '1px solid #403f3f',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
          backgroundColor: '#141414e5',
          paddingInline: '20px',
          paddingBlock: '8px',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#292929e5')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#141414e5')
        }
      >
        <div
          style={{
            border: 'none',
            borderRadius: '25px',
            width: '30px',
            height: '30px',
            backgroundColor: '#458fff',
            boxShadow: '0 2px 4px rgba(32, 32, 32, 0.79)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
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
                color: '#ffffff',
                fontWeight: 'normal',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#797979')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              Sign Out
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
