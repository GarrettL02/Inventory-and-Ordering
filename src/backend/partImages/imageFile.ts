import { basename } from 'path';

////////////////////////////////////////////////////////
//
// Small helpers for uploaded image files. No libraries,
// just Node's own Buffer and path.
//
////////////////////////////////////////////////////////

export type DetectedImageType = {
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  extension: 'jpg' | 'png' | 'webp';
};

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

///////////////////////////////////////////////////////////
//
//  detectImageType()
//  Works out what kind of image a file really is by looking at its first
//  bytes ("magic numbers"). The Content-Type header and the file name are
//  both chosen by whoever uploads, so neither can be trusted.
//    JPEG -> starts with FF D8 FF
//    PNG  -> starts with 89 50 4E 47 0D 0A 1A 0A
//    WebP -> "RIFF" at byte 0 and "WEBP" at byte 8
//  Returns null for anything else (SVG is left out on purpose, it can
//  carry scripts).
//
///////////////////////////////////////////////////////////
export function detectImageType(data: Buffer): DetectedImageType | null {
  if (
    data.length >= 3 &&
    data[0] === 0xff &&
    data[1] === 0xd8 &&
    data[2] === 0xff
  ) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }

  if (
    data.length >= PNG_SIGNATURE.length &&
    data.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }

  if (
    data.length >= 12 &&
    data.subarray(0, 4).toString('ascii') === 'RIFF' &&
    data.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { mimeType: 'image/webp', extension: 'webp' };
  }

  return null;
}

///////////////////////////////////////////////////////////
//
//  cleanOriginalName()
//  The frontend sends the user's file name in an X-File-Name header
//  (URL-encoded, since headers can't hold every character). It is only
//  stored for display - it never becomes a path on disk. This decodes it,
//  drops any folder part and caps it to the column size (255).
//  Returns null when there is nothing usable.
//
///////////////////////////////////////////////////////////
export function cleanOriginalName(header: string | undefined): string | null {
  if (!header) return null;

  try {
    // basename() treats / as the separator, so turn Windows backslashes into / first
    const name = basename(
      decodeURIComponent(header).replace(/\\/g, '/'),
    ).trim();
    return name ? name.slice(0, 255) : null;
  } catch {
    // decodeURIComponent throws on a malformed % sequence
    return null;
  }
}
