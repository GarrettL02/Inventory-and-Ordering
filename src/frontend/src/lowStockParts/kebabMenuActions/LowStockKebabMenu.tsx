import { useNavigate } from 'react-router';
import { KebabPopUpMenu } from '../../components/kebabMenu/KebabPopUpMenu';

interface LowStockKebabMenuProps {
  partId: number;
  partURL?: string | null;
}

export function LowStockKebabMenu({ partId, partURL }: LowStockKebabMenuProps) {
  const nav = useNavigate();
  return (
    <KebabPopUpMenu
      items={[
        {
          label: 'View Part Details',
          onClick: () => nav(`/parts/unordered/${partId}`),
        },
        ...(partURL
          ? [
              {
                label: 'Go to Store Page',
                onClick: () => window.open(partURL, '_blank'),
              },
            ]
          : []),
        {
          label: 'Delete Part',
          onClick: () => console.log('delete', partId),
        },
      ]}
      partId={partId}
    />
  );
}
