import { useCallback, useState } from 'react';
import { createStorageLocation } from '../../services/storageLocation/storageLocationService';
import { StorageLocationData } from '../../types/storageLocation/storageLocation';

// Saves a new storage location and tracks the request's loading / error state,
// the same way useAddNewPart does for parts.
//
//   const { addStorageLocation, loading, error } = useAddStorageLocation();
//   const created = await addStorageLocation('Shelf A');  // the new location, or null if it failed
//
// It never throws - on failure it returns null and puts the message in `error`.
export function useAddStorageLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStorageLocation = useCallback(
    async (name: string): Promise<StorageLocationData | null> => {
      setLoading(true);
      setError(null); // clear the last failure when trying again
      try {
        return await createStorageLocation(name);
      } catch (err: any) {
        setError(err.message ?? 'Could not save the storage location');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Lets the UI clear a stale error, e.g. when the user starts typing again
  const clearError = useCallback(() => setError(null), []);

  return { addStorageLocation, loading, error, clearError };
}
