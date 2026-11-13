import { ReactNode } from 'react';
import { useTheme } from '../../hooks/userSettings/useTheme';

interface HomeCardProps {
  title: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}

// Lightweight card used on the homepage. Kept separate from AccordianMenu so
// the other pages that use the accordion are not affected by this styling.
export function HomeCard({ title, count, action, children }: HomeCardProps) {
  const themeType = useTheme();
  return (
    <section
      style={{
        backgroundColor: themeType.surfaceColor,
        color: themeType.textPrimaryColor,
        border: `1px solid ${themeType.borderColor}`,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
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
          borderBottom: `1px solid ${themeType.borderColor}`,
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
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
            {title}
          </h3>
          {count !== undefined && count > 0 && (
            <span
              style={{
                backgroundColor: themeType.activeOverlayColor,
                color: themeType.textSecondaryColor,
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                padding: '2px 8px',
              }}
            >
              {count}
            </span>
          )}
        </div>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}

export const homeCardMessageStyle = {
  margin: 0,
  padding: '20px',
  fontSize: '13px',
} as const;
