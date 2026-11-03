import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, stat, unlink, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { InventoryDatabaseService } from '../databaseService/inventoryDatabase.service';
import { detectImageType } from './imageFile';
import {
  FilenameRowArraySchema,
  MAX_IMAGE_BYTES,
  PartImageRowArraySchema,
  SavedPartImage,
} from './schema/partImages.schema';

@Injectable()
export class PartImagesService {
  private readonly logger = new Logger(PartImagesService.name);

  constructor(private readonly db: InventoryDatabaseService) {}

  ///////////////////////////////////////////////////////////
  //
  //  getUploadDir()
  //  Folder the image files live in. Set UPLOAD_DIR in .env to put it
  //  somewhere else (e.g. a persistent disk on the server), otherwise it is
  //  ./uploads/partImages next to where the app is started.
  //  Read on every call (not cached) so tests can point it at a temp folder.
  //
  ///////////////////////////////////////////////////////////
  getUploadDir(): string {
    return process.env.UPLOAD_DIR
      ? resolve(process.env.UPLOAD_DIR)
      : join(process.cwd(), 'uploads', 'partImages');
  }

  // Full path of a stored file. basename() throws away any folder part, so even
  // a bad value in the database can't point outside the upload folder.
  private filePathFor(filename: string): string {
    return join(this.getUploadDir(), basename(filename));
  }

  ///////////////////////////////////////////////////////////
  //
  //  savePartImage()
  //  Store the picture for a part (one picture per part - a new upload
  //  replaces the old one).
  //    1. check size, then the real file type from its first bytes
  //    2. check the part exists
  //    3. write the file under a generated name (uuid + extension)
  //    4. in one transaction: delete the part's old rows, insert the new one
  //    5. only after that succeeded, delete the old files
  //  If step 4 fails the new file is removed again, so a failure can leave
  //  nothing behind, and the database never points at a missing file.
  //
  ///////////////////////////////////////////////////////////
  async savePartImage(
    partId: number,
    data: Buffer,
    originalName: string | null,
  ): Promise<SavedPartImage> {
    if (data.length === 0) {
      throw new BadRequestException('No image was sent');
    }

    if (data.length > MAX_IMAGE_BYTES) {
      throw new PayloadTooLargeException(
        `Image is larger than ${MAX_IMAGE_BYTES / 1024 / 1024} MB`,
      );
    }

    const type = detectImageType(data);
    if (!type) {
      throw new UnsupportedMediaTypeException(
        'Only JPEG, PNG and WebP images are allowed',
      );
    }

    const partRows = await this.db.query('SELECT id FROM parts WHERE id = ?', [
      partId,
    ]);
    if (partRows.length === 0) {
      throw new NotFoundException(`Part ${partId} not found`);
    }

    // Our own name - the user's file name is never used on disk.
    // flag 'wx' = fail instead of overwriting if the file somehow exists.
    const filename = `${randomUUID()}.${type.extension}`;
    await mkdir(this.getUploadDir(), { recursive: true });
    await writeFile(this.filePathFor(filename), data, { flag: 'wx' });

    let replacedFilenames: string[];
    try {
      replacedFilenames = await this.db.transaction(async (tx) => {
        const oldRows = FilenameRowArraySchema.parse(
          await tx.query('SELECT filename FROM partAttachments WHERE partId = ?', [
            partId,
          ]),
        );

        await tx.run('DELETE FROM partAttachments WHERE partId = ?', [partId]);
        await tx.run(
          `INSERT INTO partAttachments
             (partId, filename, originalName, mimeType, isPrimary)
           VALUES (?, ?, ?, ?, 1)`,
          [partId, filename, originalName, type.mimeType],
        );

        return oldRows.map((row) => row.filename);
      });
    } catch (error) {
      await this.removeFiles([filename]);
      throw error;
    }

    await this.removeFiles(replacedFilenames);

    return { filename, mimeType: type.mimeType };
  }

  ///////////////////////////////////////////////////////////
  //
  //  getPartImage()
  //  Where the part's picture is on disk and what type it is, so the
  //  controller can stream it. 404 if the part has no picture or the file
  //  has gone missing.
  //
  ///////////////////////////////////////////////////////////
  async getPartImage(
    partId: number,
  ): Promise<{ filePath: string; mimeType: string }> {
    const rows = PartImageRowArraySchema.parse(
      await this.db.query(
        `SELECT filename, mimeType
         FROM partAttachments
         WHERE partId = ?
         ORDER BY isPrimary DESC, id
         LIMIT 1`,
        [partId],
      ),
    );

    if (rows.length === 0) {
      throw new NotFoundException(`Part ${partId} has no image`);
    }

    const filePath = this.filePathFor(rows[0].filename);

    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException('The image file is missing on the server');
    }

    return {
      filePath,
      mimeType: rows[0].mimeType ?? 'application/octet-stream',
    };
  }

  ///////////////////////////////////////////////////////////
  //
  //  deletePartImage()
  //  Remove the part's picture (database row first, then the file).
  //  404 if the part has no picture.
  //
  ///////////////////////////////////////////////////////////
  async deletePartImage(partId: number): Promise<void> {
    const filenames = await this.db.transaction(async (tx) => {
      const rows = FilenameRowArraySchema.parse(
        await tx.query('SELECT filename FROM partAttachments WHERE partId = ?', [
          partId,
        ]),
      );

      if (rows.length === 0) {
        throw new NotFoundException(`Part ${partId} has no image`);
      }

      await tx.run('DELETE FROM partAttachments WHERE partId = ?', [partId]);
      return rows.map((row) => row.filename);
    });

    await this.removeFiles(filenames);
  }

  ///////////////////////////////////////////////////////////
  //
  //  getFilenamesForPart()
  //  Every stored file of a part. PartService asks for these before deleting
  //  a part, because the database cascade removes the rows but not the files.
  //
  ///////////////////////////////////////////////////////////
  async getFilenamesForPart(partId: number): Promise<string[]> {
    const rows = FilenameRowArraySchema.parse(
      await this.db.query('SELECT filename FROM partAttachments WHERE partId = ?', [
        partId,
      ]),
    );
    return rows.map((row) => row.filename);
  }

  ///////////////////////////////////////////////////////////
  //
  //  removeFiles()
  //  Delete files from the upload folder. Best effort: a file that is already
  //  gone is fine, and any other problem is logged, not thrown - by the time
  //  this runs the database change has already been saved, so an undeletable
  //  file only leaves an orphan behind, it should not fail the request.
  //
  ///////////////////////////////////////////////////////////
  async removeFiles(filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      try {
        await unlink(this.filePathFor(filename));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          this.logger.warn(`Could not delete image file ${filename}: ${error}`);
        }
      }
    }
  }
}
