import { useNavigate } from 'react-router-dom';
import { formatShortDate } from '../../functions';
import { HomeCard, homeCardMessageStyle } from './HomeCard';

interface ItemData {
  name: string;
  description: string;
  triggeredAt: string;
  totalRows: number;
}

export interface HomepageListComponentProps {
  itemData: ItemData[];
  loading: boolean;
  error: string | null;
  title: string;
  redirectPage?: string;
}

const truncateStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
} as const;

export function HomepageListComponent({
  itemData,
  loading,
  error,
  title,
  redirectPage,
}: HomepageListComponentProps) {
  const nav = useNavigate();

  return (
    <HomeCard
      title={title}
      count={!loading && !error ? itemData[0]?.totalRows : undefined}
      action={
        redirectPage && (
          <button
            style={{
              background: 'none',
              fontSize: '13px',
              color: '#cfcfcf',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => nav(`/${redirectPage}`)}
          >
            View all →
          </button>
        )
      }
    >
      {loading && <p style={homeCardMessageStyle}>Loading...</p>}
      {error && !loading && (
        <p style={{ ...homeCardMessageStyle, color: '#ef5350' }}>{error}</p>
      )}
      {!loading && !error && itemData.length === 0 && (
        <p style={homeCardMessageStyle}>{`No ${title.toLowerCase()} yet.`}</p>
      )}
      {!loading && !error && itemData.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {itemData.map((item, index) => (
            <li
              key={index}
              className="storage-location-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 20px',
                borderTop: index === 0 ? 'none' : '1px solid #2e2e2e',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ ...truncateStyle, fontSize: '14px' }}>
                  {item.name}
                </div>
                <div
                  style={{
                    ...truncateStyle,
                    fontSize: '12px',
                    color: '#a7a7a7',
                    marginTop: '2px',
                  }}
                >
                  {item.description}
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#a7a7a7',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatShortDate(item.triggeredAt)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </HomeCard>
  );
}
