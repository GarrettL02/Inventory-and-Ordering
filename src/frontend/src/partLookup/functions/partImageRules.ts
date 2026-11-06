// Same limits as the backend (allowed types and MAX_IMAGE_BYTES). They are checked
// in the browser too only so the user gets an instant message instead of waiting
// for an upload that the server would reject anyway.
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Returns an error message for a picture the backend would reject, or null if it's fine
export function validatePartImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG and WebP images are allowed';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 5 MB or smaller';
  }
  return null;
}
