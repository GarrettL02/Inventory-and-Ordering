import { Modal } from '../../components/modal/Modal';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { CancelButton } from '../../components/buttons/cancelButton/CancelButton';
import { useDeleteStorageLocation } from '../../hooks/storageLocation/useDeleteStorageLocation';

export interface ConfirmDeleteStorageLocationModalProps {
  storageLocationId: number;
  storageLocationName: string;
  onClose: () => void;
  // Called after the location was deleted, so the list can refresh
  onDeleted?: () => void;
}

export function ConfirmDeleteStorageLocationModal({
  storageLocationId,
  storageLocationName,
  onClose,
  onDeleted,
}: ConfirmDeleteStorageLocationModalProps) {
  const { deleteStorageLocation, loading, error } = useDeleteStorageLocation();

  const handleDelete = async () => {
    const deleted = await deleteStorageLocation(storageLocationId);
    // false means it failed (e.g. parts are still stored there) - stay open and
    // show the error from the hook
    if (!deleted) return;

    onDeleted?.();
    onClose();
  };

  return (
    <Modal
      modalTitle="Delete Storage Location"
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
        Delete <strong>{storageLocationName}</strong>? This can't be undone.
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
