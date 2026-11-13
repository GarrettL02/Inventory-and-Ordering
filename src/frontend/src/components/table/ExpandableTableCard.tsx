import { useContext, useState } from 'react';
import { ThemeContext } from '../../hooks/userSettings/useTheme';

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
  const { themeType } = useContext(ThemeContext)!;

  const toggle = () => {
    setOpen((prev) => !prev);
    setHasOpened(true);
  };

  return (
    <>
      <tr
        style={{
          display: 'grid',
          gridTemplateColumns: tableCardGrid, // parts table grid
          borderBottom: open
            ? 'none'
            : `1px solid ${themeType.borderSubtleColor}`,
          backgroundColor: open
            ? themeType.surfaceHoverColor
            : themeType.surfaceColor,
          height: '50px',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '13px',
          color: themeType.textPrimaryColor,
        }}
        onClick={toggle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = themeType.surfaceHoverColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = open
            ? themeType.surfaceHoverColor
            : themeType.surfaceColor)
        }
      >
        {cardContent}
      </tr>
      <tr
        style={{
          display: 'block',
          backgroundColor: themeType.surfaceExpandedColor,
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
                  borderBottom: `1px solid ${themeType.borderSubtleColor}`,
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
