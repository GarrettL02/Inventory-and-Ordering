import { useState } from 'react';
import { Header } from '../header/Header';
import { SideMenu } from '../sidemenu/SideMenu';
import { PartsOrderedIcon } from '../icons/PartsOrderedIcon';
import { NeedOrderedIcon } from '../icons/NeedOrderedIcon';
import { PartPagePartIcon } from '../icons/PartPagePartIcon';

interface HeaderSidebarComponentProps {
  children: React.ReactNode;
}

export function HeaderSidebarComponent({
  children,
}: HeaderSidebarComponentProps) {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const sideMenuLinks = [
    {
      name: 'Low Stock',
      location: '/parts/unordered',
      icon: <NeedOrderedIcon />,
      lineBreak: false,
    },
    {
      name: 'Ordered',
      location: '/parts/ordered',
      icon: <PartsOrderedIcon />,
      lineBreak: true,
    },
    {
      name: 'Part Search',
      location: '/parts/partlookup',
      icon: <PartPagePartIcon />,
      lineBreak: true,
    },
  ];

  return (
    <div
      style={{
        padding: '3rem',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        backgroundColor: '#1d1d1dff',
        minHeight: '100dvh',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Header
        onHamburgerMenuClick={() => {
          setMenuExpanded(!menuExpanded);
        }}
      />
      <SideMenu
        isExpanded={menuExpanded}
        setIsExpanded={setMenuExpanded}
        menuLinks={sideMenuLinks}
      />
      {children}
    </div>
  );
}
