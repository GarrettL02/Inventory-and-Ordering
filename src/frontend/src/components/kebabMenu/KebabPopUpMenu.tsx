import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { KebabIcon } from './KebabIcon';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface KebabPopUpMenuProps {
  items: MenuItem[];
  partId: number;
}

export function KebabPopUpMenu({ items, partId }: KebabPopUpMenuProps) {
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

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedMenuHeight = items.length * 37;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < estimatedMenuHeight;

      setMenuStyle({
        position: 'fixed',
        top: openUpward ? 'auto' : rect.bottom,
        bottom: openUpward ? window.innerHeight - rect.top : 'auto',
        right: window.innerWidth - rect.right,
        backgroundColor: '#d9d8d8',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
        minWidth: '150px',
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={triggerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
      }}
    >
      <KebabIcon onClick={handleToggle} />

      {isOpen &&
        ReactDOM.createPortal(
          <div style={menuStyle} onMouseDown={(e) => e.stopPropagation()}>
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#c0bfbf')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
