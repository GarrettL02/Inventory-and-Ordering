import { z } from 'zod';

// Biggest image the API accepts (5 MB). main.ts uses the same number as the
// request body limit, so an oversized upload is rejected before it is read.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

////////////////////////////////////////////////////////
//
// Part Image Row Schema
// (filename + mimeType of a row in partAttachments)
//
////////////////////////////////////////////////////////
export const PartImageRowSchema = z.object({
  filename: z.string(),
  mimeType: z.string().nullable(),
});

export const PartImageRowArraySchema = z.array(PartImageRowSchema);

////////////////////////////////////////////////////////
//
// Filename Row Schema
// (SELECT filename FROM partAttachments ...)
//
////////////////////////////////////////////////////////
export const FilenameRowArraySchema = z.array(
  z.object({ filename: z.string() }),
);

////////////////////////////////////////////////////////
//
// Saved Part Image Schema
// (what PUT /parts/:id/image answers with)
//
////////////////////////////////////////////////////////
export const SavedPartImageSchema = z.object({
  filename: z.string(),
  mimeType: z.string(),
});

export type SavedPartImage = z.infer<typeof SavedPartImageSchema>;
