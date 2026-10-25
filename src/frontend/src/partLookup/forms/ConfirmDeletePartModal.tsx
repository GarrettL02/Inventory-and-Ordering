import { Modal } from '../../components/modal/Modal';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { CancelButton } from '../../components/buttons/cancelButton/CancelButton';
import { useDeletePart } from '../hooks/useDeletePart';

export interface ConfirmDeletePartModalProps {
  partId: number;
  partName: string;
  onClose: () => void;
  // Called after the part was deleted, so the page can refresh its table
  onDeleted?: () => void;
}

export function ConfirmDeletePartModal({
  partId,
  partName,
  onClose,
  onDeleted,
}: ConfirmDeletePartModalProps) {
  const { deletePart, loading, error } = useDeletePart();

  const handleDelete = async () => {
    const deleted = await deletePart(partId);
    // false means it failed - stay open and show the error from the hook
    if (!deleted) return;

    onDeleted?.();
    onClose();
  };

  return (
    <Modal
      modalTitle="Delete Part"
      onClose={onClose}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <GeneralButton
            buttonText={loading ? 'Deleting...' : 'Delete'}
            onClick={handleDelete}
            disabled={loading}
          />
        </>
      }
    >
      <p style={{ margin: 0, fontSize: '14px' }}>
        Delete <strong>{partName}</strong>? This also removes its stock history
        and any open low-stock request for it. This can't be undone.
      </p>
      {error && (
        <div
          role="alert"
          style={{
            marginTop: '12px',
            color: '#ff6b6b',
            border: '1px solid #4f0000',
            borderRadius: '5px',
            padding: '8px',
            fontSize: '12px',
          }}
        >
          {error}
        </div>
      )}
    </Modal>
  );
}
