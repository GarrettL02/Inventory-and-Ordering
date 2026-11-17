import { useCallback, useState } from 'react';
import { deleteStorageLocation as deleteStorageLocationService } from '../../services/storageLocation/storageLocationService';

// Deletes a storageLocation and tracks the request's loading / error state.
//
//   const { deleteStorageLocation, loading, error } = useDeleteStorageLocation();
//   const ok = await deleteStorageLocation(storageLocationId);   // true if deleted, false if it failed
//
// It never throws - on failure it returns false and puts the message in `error`.
export function useDeleteStorageLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStorageLocation = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteStorageLocationService(id);
        return true;
      } catch (err: any) {
        setError(err.message ?? 'Could not delete the location');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { deleteStorageLocation, loading, error };
}
