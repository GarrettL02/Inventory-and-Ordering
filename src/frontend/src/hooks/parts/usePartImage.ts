import { useCallback, useState } from 'react';
import {
  deletePartImage,
  uploadPartImage,
} from '../../services/parts/partsService';
import { validatePartImage } from '../../partLookup/functions/partImageRules';

// Upload / replace / remove the picture of one part and track the request's
// saving / error state, the same way useAddNewPart does.
//
//   const { uploadImage, removeImage, clearError, saving, error } = usePartImage(partId, refetch);
//   await uploadImage(file);
//
// It never throws - on failure the message goes into `error`. `onChanged` is
// called after a successful change so the page can reload the part.
export function usePartImage(partId: number, onChanged: () => void) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (work: () => Promise<void>) => {
      setSaving(true);
      setError(null); // clear the last failure when trying again
      try {
        await work();
        onChanged();
      } catch (err: any) {
        setError(err.message ?? 'Could not save the image');
      } finally {
        setSaving(false);
      }
    },
    [onChanged],
  );

  const uploadImage = useCallback(
    async (file: File) => {
      const problem = validatePartImage(file);
      if (problem) {
        setError(problem);
        return;
      }
      await run(() => uploadPartImage(partId, file));
    },
    [partId, run],
  );

  const removeImage = useCallback(
    () => run(() => deletePartImage(partId)),
    [partId, run],
  );

  const clearError = useCallback(() => setError(null), []);

  return { uploadImage, removeImage, clearError, saving, error };
}
