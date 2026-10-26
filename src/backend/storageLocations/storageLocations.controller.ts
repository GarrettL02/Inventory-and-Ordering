import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StorageLocationsService } from './storageLocations.service';
import { AuthGuard } from '../auth/auth.guard';

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

  // Get a storage location by its ID
  @Get(':id')
  async getStorageLocationsById(
    @Param('id', ParseIntPipe) storageLocationId: number,
  ) {
    return this.storageLocationService.getStorageLocationById(
      storageLocationId,
    );
  }

  // Add or remove stock for a part (id = the part's id).
  // Body: { "delta": -2, "reason": "used on job" }
  //   delta > 0 adds stock, delta < 0 removes it, reason is optional
  // -> 201 with { partId, stockLevel, minStockLevel, lowStockEventId }
  //   @Post(':id')
  //   async adjustStock(
  //     @Param('id', ParseIntPipe) partId: number,
  //     @Body() body: unknown,
  //     @CurrentUser() user: AuthUser,
  //   ) {
  //     const input = parseOrBadRequest(AdjustStockSchema, body);
  //     return this.stockMovementsService.adjustStock(partId, user.id, input);
  //   }
}
