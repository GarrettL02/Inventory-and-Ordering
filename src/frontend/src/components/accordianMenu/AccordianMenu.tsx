import { useRef, useState } from 'react';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface AccordionMenuProps {
  children: React.ReactNode;
  title: string;
  shrinkable?: boolean;
  closedExtraText?: string;
  initiallyShrunk?: boolean;
  sideTitleSection?: React.ReactNode;
}

export function AccordianMenu({
  children,
  title,
  shrinkable,
  closedExtraText,
  initiallyShrunk,
  sideTitleSection,
}: AccordionMenuProps) {
  const themeType = useTheme();
  const [isOpen, setIsOpen] = useState(initiallyShrunk ? false : true);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        border: `2px solid ${themeType.borderColor}`,
        borderRadius: '10px',
        backgroundColor: themeType.panelBackgroundColor,
        color: themeType.textPrimaryColor,
        padding: '20px',
        marginBlock: '30px',
      }}
    >
      <div
        style={{
          paddingBottom: isOpen ? '20px' : '0px',
          fontWeight: 'bold',
          fontSize: '20px',
          paddingInline: shrinkable ? '0px' : '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          transition: 'padding-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {shrinkable && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              style={{
                backgroundColor: themeType.activeOverlayColor,
                borderRadius: '10px',
                border: 'none',
                color: themeType.textPrimaryColor,
                cursor: 'pointer',
                padding: '2px 8px',
                fontSize: '14px',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-180deg)',
              }}
            >
              ⮝
            </button>
          )}
          {title}
        </div>
        {!isOpen && closedExtraText}
        {isOpen && sideTitleSection && sideTitleSection}
      </div>

      <div
        ref={bodyRef}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}
