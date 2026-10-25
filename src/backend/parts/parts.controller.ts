import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartService } from './parts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import type { AuthUser } from '../auth/schema/auth.schema';
import { parseOrBadRequest } from '../common/parseOrBadRequest';
import {
  AdjustStockSchema,
  CreatePartSchema,
  PartsQuerySchema,
} from './schema/parts.schema';

@Controller('parts')
@UseGuards(AuthGuard)
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Get()
  async getAllParts(@Query() query: unknown) {
    const { page, limit, search } = parseOrBadRequest(PartsQuerySchema, query);
    return this.partService.getAllParts(page, limit, search);
  }

  // Add New Part form. Body: { name, description, stockLevel, minStockLevel,
  // manufacturerName, manufacturerPartNumber, partURL, averagePrice?, comment?,
  // categoryId?, storageLocationId? }  -> 201 with the created part
  @Post()
  async createPart(@Body() body: unknown, @CurrentUser() user: AuthUser) {
    const input = parseOrBadRequest(CreatePartSchema, body);
    return this.partService.createPart(user.id, input);
  }

  @Get(':id')
  async getPartById(@Param('id', ParseIntPipe) id: number) {
    return this.partService.getPartById(id);
  }

  // Body: { "delta": -2, "reason": "used on job" }  (reason is optional)
  @Post(':id/stock')
  async adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown,
    @CurrentUser() user: AuthUser,
  ) {
    const input = parseOrBadRequest(AdjustStockSchema, body);
    return this.partService.adjustStock(id, user.id, input);
  }

  // Permanently deletes the part (and its stock history, attachments, open low stock events)
  // -> 204 No Content, or 404 if there is no such part
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePart(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.partService.deletePart(id);
  }
}
