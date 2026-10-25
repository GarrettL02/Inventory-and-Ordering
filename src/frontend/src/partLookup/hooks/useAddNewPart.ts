import { useCallback, useState } from 'react';
import { submitNewPartData } from '../../services/parts/partsService';
import { AddNewPartFormData, PartDetails } from '../types/Part';

// Saves a new part and tracks the request's loading / error state, the same way
// the useFetch* hooks do for reads.
//
//   const { addNewPart, loading, error } = useAddNewPart();
//   const created = await addNewPart(formData);   // PartDetails, or null if it failed
//
// It never throws - on failure it returns null and puts the message in `error`.
export function useAddNewPart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewPart = useCallback(
    async (data: AddNewPartFormData): Promise<PartDetails | null> => {
      setLoading(true);
      setError(null); // clear the last failure when trying again
      try {
        return await submitNewPartData(data);
      } catch (err: any) {
        setError(err.message ?? 'Could not save the part');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { addNewPart, loading, error };
}
