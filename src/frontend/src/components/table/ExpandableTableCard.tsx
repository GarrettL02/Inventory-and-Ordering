import { useState } from 'react';

export interface ExpandableTableCardProps {
  cardContent: React.ReactNode;
  expandedContent: React.ReactNode;
  tableCardGrid: string;
}

export function ExpandableTableCard({
  cardContent,
  expandedContent,
  tableCardGrid,
}: ExpandableTableCardProps) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
    setHasOpened(true);
  };

  const overflowSectionStyle = {
    paddingInline: '2%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <tr
        style={{
          display: 'grid',
          gridTemplateColumns: tableCardGrid, // parts table grid
          borderBottom: open ? 'none' : '1px solid #9c9b9bff',
          backgroundColor: open ? '#1a1a1a' : '#222222ff',
          height: '50px',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '13px',
        }}
        onClick={toggle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#1a1a1a')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = open
            ? '#1a1a1a'
            : '#222222ff')
        }
      >
        {cardContent}
      </tr>
      <tr
        style={{
          display: 'block',
          backgroundColor: '#1a1a1a',
        }}
      >
        <td style={{ display: 'block', padding: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: open ? '1fr' : '0fr',
              transition:
                'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                minHeight: 0,
                visibility: open ? 'visible' : 'hidden',
                transition: open ? 'none' : 'visibility 0s linear 0.35s',
              }}
            >
              <div
                style={{
                  padding: '14px 2% 18px',
                  borderBottom: '1px solid #9c9b9bff',
                }}
              >
                {hasOpened && expandedContent}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
