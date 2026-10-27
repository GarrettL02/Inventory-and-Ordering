import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StorageLocationsService } from './storageLocations.service';
import { AuthGuard } from '../auth/auth.guard';
import { parseOrBadRequest } from '../common/parseOrBadRequest';
import { CreateStorageLocationSchema } from './schema/storageLocations.schema';

@Controller('storagelocations')
@UseGuards(AuthGuard)
export class StorageLocationsController {
  constructor(
    private readonly storageLocationService: StorageLocationsService,
  ) {}

  // Stock history for one part (id = the part's id)
  @Get('')
  async getAllStorageLocations() {
    return this.storageLocationService.getAllStorageLocations();
  }

  // Add a new storage location. Body: { "name": "Shelf A - Bin 3" }
  // -> 201 with { data: { id, name } }
  // -> 400 if the name is missing / empty / too long, 409 if the name already exists
  @Post()
  async createStorageLocation(@Body() body: unknown) {
    // Check the body is what we expect (throws a 400 if not), then hand it to the service
    const input = parseOrBadRequest(CreateStorageLocationSchema, body);
    return this.storageLocationService.createStorageLocation(input);
  }

  // Get a storage location by its ID
  @Get(':id')
  async getStorageLocationsById(
    @Param('id', ParseIntPipe) storageLocationId: number,
  ) {
    return this.storageLocationService.getStorageLocationById(
      storageLocationId,
    );
  }

  // Permanently deletes the storage location
  // -> 204 No Content, or 404 if there is no such storage location
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStorageLocation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.storageLocationService.deleteStorageLocation(id);
  }
}
