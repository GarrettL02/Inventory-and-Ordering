import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  StreamableFile,
  UseGuards,
  Body,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { AuthGuard } from '../auth/auth.guard';
import { cleanOriginalName } from './imageFile';
import { PartImagesService } from './partImages.service';
import { SavedPartImage } from './schema/partImages.schema';

// One picture per part. :id is the part's id.
@Controller('parts/:id/image')
@UseGuards(AuthGuard)
export class PartImagesController {
  constructor(private readonly partImagesService: PartImagesService) {}

  // The picture itself (JPEG / PNG / WebP) -> 200, or 404 if the part has none.
  // An <img src="/api/parts/5/image?v=<filename>"> works because the browser
  // sends the login cookie. The frontend adds ?v=<filename> so a replaced
  // picture isn't served from the browser cache.
  @Get()
  @Header('Cache-Control', 'private, max-age=86400')
  @Header('X-Content-Type-Options', 'nosniff')
  async getImage(
    @Param('id', ParseIntPipe) partId: number,
  ): Promise<StreamableFile> {
    const { filePath, mimeType } =
      await this.partImagesService.getPartImage(partId);
    return new StreamableFile(createReadStream(filePath), { type: mimeType });
  }

  // Upload or replace the picture. The image is the raw request body (no
  // multipart): send it with its own Content-Type, e.g.
  //   fetch('/api/parts/5/image', { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
  // Optional header X-File-Name = URL-encoded original file name.
  // main.ts registers the parser that turns image/* bodies into a Buffer (max 5 MB).
  // -> 200 with { filename, mimeType }
  @Put()
  async saveImage(
    @Param('id', ParseIntPipe) partId: number,
    @Body() body: unknown,
    @Headers('x-file-name') fileName: string | undefined,
  ): Promise<SavedPartImage> {
    // If the Content-Type wasn't image/* the parser leaves the body alone and it isn't a Buffer
    if (!Buffer.isBuffer(body)) {
      throw new BadRequestException(
        'Send the image as the request body with an image/* Content-Type',
      );
    }

    return this.partImagesService.savePartImage(
      partId,
      body,
      cleanOriginalName(fileName),
    );
  }

  // Remove the picture -> 204 No Content, or 404 if the part has none
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('id', ParseIntPipe) partId: number): Promise<void> {
    await this.partImagesService.deletePartImage(partId);
  }
}
