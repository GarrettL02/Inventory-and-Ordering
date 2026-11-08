import {
  useRef,
  useEffect,
  useState,
  Fragment,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from 'react';
import { NavLink } from 'react-router';

interface SideMenuLink {
  name: string;
  location: string;
  icon: React.ReactNode;
  lineBreak: boolean;
  mountedToBottom?: boolean;
}

interface SideMenuProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  menuLinks: SideMenuLink[];
}

const COLLAPSED_WIDTH = '48px';
const EXPANDED_WIDTH = '200px';
const ACCENT = '#580909ff';

const menuStyle = (isExpanded: boolean): CSSProperties => ({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 999,
  width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
  boxSizing: 'border-box',
  padding: '90px 4px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  overflowX: 'hidden',
  backgroundColor: '#262626',
  borderRight: '1px solid #ffffff14',
  boxShadow: isExpanded ? '8px 0 24px #00000066' : 'none',
  transition: 'width 0.25s ease, box-shadow 0.25s ease',
});

const linkStyle = (
  isActive: boolean,
  isHovered: boolean,
  isFocused: boolean,
): CSSProperties => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  height: 40,
  paddingLeft: 8, // centers a 24px icon in the collapsed rail
  borderRadius: 8,
  color: isActive || isHovered ? '#ffffff' : '#9a9a9a',
  backgroundColor: isActive
    ? '#ffffff1a'
    : isHovered
      ? '#ffffff10'
      : 'transparent',
  fontSize: 14,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  outline: isFocused ? `2px solid ${ACCENT}` : 'none',
  outlineOffset: -2,
  transition: 'background-color 0.15s ease, color 0.15s ease',
});

const accentBarStyle: CSSProperties = {
  position: 'absolute',
  left: -4,
  top: 8,
  bottom: 8,
  width: 3,
  borderRadius: '0 3px 3px 0',
  backgroundColor: ACCENT,
};

// keeps icons from being squashed by the label while the menu resizes
const iconWrapperStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 24,
};

const labelStyle = (isExpanded: boolean): CSSProperties => ({
  flexShrink: 0,
  opacity: isExpanded ? 1 : 0,
  transition: `opacity 0.15s ease ${isExpanded ? '0.1s' : '0s'}`,
});

const dividerStyle: CSSProperties = {
  width: 'calc(100% - 16px)',
  margin: '8px auto',
  border: 0,
  borderTop: '1px solid #ffffff1a',
};

const bottomStyle: CSSProperties = { marginTop: 'auto' };

function SideMenuItem({
  link,
  isExpanded,
}: {
  link: SideMenuLink;
  isExpanded: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <NavLink
      to={link.location}
      title={link.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // only show the ring for keyboard focus, not mouse clicks
      onFocus={(e) => setIsFocused(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocused(false)}
      style={({ isActive }) => linkStyle(isActive, isHovered, isFocused)}
    >
      {({ isActive }) => (
        <>
          {isActive && <span style={accentBarStyle} />}
          <span style={iconWrapperStyle}>{link.icon}</span>
          <span style={labelStyle(isExpanded)}>{link.name}</span>
        </>
      )}
    </NavLink>
  );
}

export function SideMenu({
  isExpanded,
  setIsExpanded,
  menuLinks,
}: SideMenuProps) {
  const triggerRef = useRef<HTMLElement>(null);

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

  const mainLinks = menuLinks.filter((link) => !link.mountedToBottom);
  const bottomLinks = menuLinks.filter((link) => link.mountedToBottom);

  return (
    <nav ref={triggerRef} aria-label="Main" style={menuStyle(isExpanded)}>
      {mainLinks.map((link) => (
        <Fragment key={link.name}>
          <SideMenuItem link={link} isExpanded={isExpanded} />
          {link.lineBreak && <hr style={dividerStyle} />}
        </Fragment>
      ))}
      <div style={bottomStyle}>
        {bottomLinks.map((link) => (
          <SideMenuItem key={link.name} link={link} isExpanded={isExpanded} />
        ))}
      </div>
    </nav>
  );
}
