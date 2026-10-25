import { useCallback, useState } from 'react';
import { deletePartById } from '../../services/parts/partsService';

// Deletes a part and tracks the request's loading / error state.
//
//   const { deletePart, loading, error } = useDeletePart();
//   const ok = await deletePart(partId);   // true if deleted, false if it failed
//
// It never throws - on failure it returns false and puts the message in `error`.
export function useDeletePart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePart = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deletePartById(id);
      return true;
    } catch (err: any) {
      setError(err.message ?? 'Could not delete the part');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePart, loading, error };
}
