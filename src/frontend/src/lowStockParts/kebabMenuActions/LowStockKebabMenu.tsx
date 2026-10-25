import { useNavigate } from 'react-router';
import { KebabPopUpMenu } from '../../components/kebabMenu/KebabPopUpMenu';

interface LowStockKebabMenuProps {
  partId: number;
  partURL?: string | null;
  // When given, 'Delete Part' calls this (e.g. to open a confirm dialog)
  onDelete?: () => void;
}

export function LowStockKebabMenu({
  partId,
  partURL,
  onDelete,
}: LowStockKebabMenuProps) {
  const nav = useNavigate();
  return (
    <KebabPopUpMenu
      items={[
        {
          label: 'View Part Details',
          onClick: () => nav(`/inventory/${partId}`),
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
          onClick: () =>
            onDelete ? onDelete() : console.log('delete', partId),
        },
      ]}
      partId={partId}
    />
  );
}
