import { useState } from 'react';
import { Header } from '../header/Header';
import { SideMenu } from '../sidemenu/SideMenu';
import { PartsOrderedIcon } from '../icons/PartsOrderedIcon';
import { NeedOrderedIcon } from '../icons/NeedOrderedIcon';
import { PartPagePartIcon } from '../icons/PartPagePartIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { AssetsIcon } from '../icons/AssetsIcon';
import { SettingsIcon } from '../icons/SettingsIcon';

interface HeaderSidebarComponentProps {
  children: React.ReactNode;
}

export function HeaderSidebarComponent({
  children,
}: HeaderSidebarComponentProps) {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const sideMenuLinks = [
    {
      name: 'Home',
      location: '/home',
      icon: <HomeIcon />,
      lineBreak: true,
    },
    {
      name: 'Part Search',
      location: '/inventory',
      icon: <PartPagePartIcon />,
      lineBreak: false,
    },
    {
      name: 'Assets',
      location: '/assets',
      icon: <AssetsIcon />,
      lineBreak: true,
    },
    {
      name: 'Low Stock',
      location: '/lowstock',
      icon: <NeedOrderedIcon />,
      lineBreak: false,
    },
    {
      name: 'Ordered',
      location: '/ordered',
      icon: <PartsOrderedIcon />,
      lineBreak: true,
    },
    {
      name: 'Settings',
      location: '/settings',
      icon: <SettingsIcon />,
      lineBreak: false,
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
