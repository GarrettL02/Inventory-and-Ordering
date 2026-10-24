import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { NavLink } from 'react-router';

interface SideMenuLinks {
  name: string;
  location: string;
  icon: React.ReactNode;
  lineBreak: boolean;
  mountedToBottom?: boolean;
}

interface SideMenuProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  menuLinks: SideMenuLinks[];
}

export function SideMenu({
  isExpanded,
  setIsExpanded,
  menuLinks,
}: SideMenuProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#ffffff' : '#777777',
    cursor: 'pointer',
    textDecoration: 'none',
    paddingBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    marginRight: '20%',
    marginLeft: '20%',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !target.closest('[data-hamburger-toggle]')
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <div
      ref={triggerRef}
      style={{
        backgroundColor: '#212121ff',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 999,
        width: isExpanded ? '130px' : '40px',
        transition: 'width 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '100px',
          gap: 30,
        }}
      >
        {menuLinks.map((link) => (
          <>
            <NavLink key={link.name} to={link.location} style={linkStyle}>
              <>
                <span
                  style={{
                    width: isExpanded ? 'auto' : 0,
                    paddingRight: isExpanded ? '10px' : 0,
                    minWidth: 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    transition: 'width 0.3s ease, padding-right 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transform: isExpanded
                        ? 'translateX(0)'
                        : 'translateX(-100%)',
                      opacity: isExpanded ? 1 : 0,
                      transition: 'transform 0.3s ease, opacity 0.2s ease',
                    }}
                  >
                    {link.name}
                  </span>
                </span>
                {link.icon}
              </>
            </NavLink>
            <>
              {link.lineBreak && (
                <hr style={{ color: '#ffffff', width: '20px' }} />
              )}
            </>
          </>
        ))}
      </div>
    </div>
  );
}
