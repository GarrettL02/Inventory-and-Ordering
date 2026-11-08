import { useNavigate } from 'react-router';
import { KebabPopUpMenu } from '../../../components/kebabMenu/KebabPopUpMenu';

interface PartsKebabMenuProps {
  partId: number;
  // When given, 'Delete Part' calls this (e.g. to open a confirm dialog)
  onDelete?: () => void;
}

export function PartsKebabMenu({ partId, onDelete }: PartsKebabMenuProps) {
  const nav = useNavigate();
  return (
    <KebabPopUpMenu
      items={[
        {
          label: 'View Part Details',
          onClick: () => nav(`/inventory/${partId}`),
        },
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
