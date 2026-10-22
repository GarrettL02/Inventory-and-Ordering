import { useState } from 'react';

interface HamburgerMneuProps {
  onMenuClick: () => void;
}

export function HamburgerMenu({ onMenuClick }: HamburgerMneuProps) {
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      style={{
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        transform: isClicked ? 'scale(0.85)' : 'scale(1)',
        transition: 'transform 0.1s ease',
      }}
      onClick={() => onMenuClick()}
      onMouseEnter={() => setIsMenuHovered(true)}
      onMouseLeave={() => setIsMenuHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="14"
          y1="20"
          x2="50"
          y2="20"
          stroke={isMenuHovered ? '#ffffff' : '#9c9c9c'}
          stroke-width="4"
          stroke-linecap="round"
        />

        <line
          x1="14"
          y1="32"
          x2="50"
          y2="32"
          stroke={isMenuHovered ? '#ffffff' : '#9c9c9c'}
          stroke-width="4"
          stroke-linecap="round"
        />

        <line
          x1="14"
          y1="44"
          x2="50"
          y2="44"
          stroke={isMenuHovered ? '#ffffff' : '#9c9c9c'}
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    </button>
  );
}
