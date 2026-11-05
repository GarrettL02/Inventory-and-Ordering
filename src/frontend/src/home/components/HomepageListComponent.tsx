import { useNavigate } from 'react-router-dom';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { getDatefromDateTimeString } from '../../functions';

interface ItemData {
  name: string;
  description: string;
  triggeredAt: string;
}

export interface HomepageListComponentProps {
  itemData: ItemData[];
  loading: boolean;
  error: string | null;
  title: string;
  redirectPage?: string;
}

export function HomepageListComponent({
  itemData,
  loading,
  error,
  title,
  redirectPage,
}: HomepageListComponentProps) {
  const nav = useNavigate();

  const messageStyle = {
    margin: 0,
    padding: '12px 16px',
    color: '#a7a7a7',
    fontSize: '13px',
  };
  const overflowSectionStyle = {
    paddingInline: '2%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <AccordianMenu
      title={title}
      openExtraText={
        redirectPage && (
          <button
            style={{
              background: 'none',
              fontSize: '14px',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => nav(`/${redirectPage}`)}
          >
            View Page
          </button>
        )
      }
    >
      {loading && <p style={messageStyle}>Loading...</p>}
      {!loading && !error && itemData.length === 0 && (
        <p style={messageStyle}>No recent low stock items yet.</p>
      )}
      {!loading && !error && itemData.length > 0 && (
        <>
          <div
            style={{
              padding: '0 16px 8px',
              color: '#a7a7a7',
              fontSize: '12px',
            }}
          >
            {`${itemData.length} ${title}`}
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: '280px',
              overflowY: 'auto',
              border: '1px solid #4a4a4a',
              borderRadius: '8px',
              backgroundColor: '#1a1a1a',
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
                  gap: '12px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  borderTop: index === 0 ? 'none' : '1px solid #333333',
                }}
              >
                <div
                  style={{ ...overflowSectionStyle, width: '70%' }}
                >{`${item.name} - ${item.description}`}</div>
                <div
                  style={{
                    width: '30%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {getDatefromDateTimeString(item.triggeredAt)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </AccordianMenu>
  );
}
