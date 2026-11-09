import { useRef, useState } from 'react';

interface AccordionMenuProps {
  children: React.ReactNode;
  title: string;
  shrinkable?: boolean;
  closedExtraText?: string;
  initiallyShrunk?: boolean;
  sideTitleSection?: React.ReactNode;
}

// Same look as HomeCard on the homepage: dark card, thin border, divider under
// the header, 16px semi-bold title. The shrink button and animation stay the same.
export function AccordianMenu({
  children,
  title,
  shrinkable,
  closedExtraText,
  initiallyShrunk,
  sideTitleSection,
}: AccordionMenuProps) {
  const [isOpen, setIsOpen] = useState(initiallyShrunk ? false : true);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <section
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '12px',
        marginBlock: '20px',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '14px 20px',
          borderBottom: isOpen ? '1px solid #333333' : '1px solid transparent',
          transition: 'border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
          }}
        >
          {shrinkable && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              style={{
                backgroundColor: '#ffffff1a',
                borderRadius: '10px',
                border: 'none',
                color: '#ffffff',
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
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
            {title}
          </h3>
        </div>
        {!isOpen && closedExtraText && (
          <span style={{ color: '#a7a7a7', fontSize: '13px' }}>
            {closedExtraText}
          </span>
        )}
        {isOpen && sideTitleSection && sideTitleSection}
      </header>

      <div
        ref={bodyRef}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
