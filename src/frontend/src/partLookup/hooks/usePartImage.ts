import { useCallback, useState } from 'react';
import {
  deletePartImage,
  uploadPartImage,
} from '../../services/parts/partsService';

// Same limits as the backend (MAX_IMAGE_BYTES and the allowed types). They are checked
// here too only so the user gets an instant message instead of waiting for an upload.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Upload / replace / remove the picture of one part and track the request's
// saving / error state, the same way useAddNewPart does.
//
//   const { uploadImage, removeImage, saving, error } = usePartImage(partId, refetch);
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
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG and WebP images are allowed');
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError('Image must be 5 MB or smaller');
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

  return { uploadImage, removeImage, saving, error };
}
