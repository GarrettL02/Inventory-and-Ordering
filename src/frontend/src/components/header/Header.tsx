import { HamburgerMenu } from '../hamburgerMenu/HamburgerMenu';
import { AccountHeaderSection } from '../account/AccountHeaderSection';

interface HeaderProps {
  children?: React.ReactNode;
  onHamburgerMenuClick: () => void;
}

// const headerGridColumns = '.2fr 3fr 2fr 5fr';
const headerGridColumns = '.2fr 3fr 2fr';

export function Header({ children, onHamburgerMenuClick }: HeaderProps) {
  return (
    <div
      style={{
        backgroundColor: '#242424ff',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        minHeight: '40px',
        maxHeight: '45px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: headerGridColumns,
          alignItems: 'center',
        }}
      >
        <div
          data-hamburger-toggle
          style={{ gridColumn: 1, marginBottom: '10px' }}
        >
          <HamburgerMenu onMenuClick={() => onHamburgerMenuClick()} />
        </div>
        <div
          style={{
            gridColumn: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src="/fastecServicesLogo.png"
            alt="Fastec Services"
            style={{
              height: '30px', // leave some breathing room under 60px
              width: 'auto',
              mixBlendMode: 'multiply' as any,
              marginLeft: '10px',
              paddingBottom: '10px',
            }}
          />
          <h2 style={{ fontSize: '15px', paddingBottom: '15px' }}>
            Inventory Management System
          </h2>
        </div>

        <div
          style={{
            gridColumn: 4,
            alignItems: 'center',
            cursor: 'pointer',
            justifySelf: 'end',
            fontSize: '15px',
            paddingBottom: '15px',
          }}
        >
          {children}
          <AccountHeaderSection />
        </div>
      </div>
    </div>
  );
}
