import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LowStockService } from './lowStockEvent.service';
import { AuthGuard } from '../auth/auth.guard';
import { parseOrBadRequest } from '../common/parseOrBadRequest';
import { PaginationQuerySchema } from '../common/schema/common.schema';

@Controller('lowstock')
@UseGuards(AuthGuard)
export class LowStockController {
  constructor(private readonly lowStockService: LowStockService) {}

  @Get()
  async getLowStockParts() {
    return this.lowStockService.getLowStockParts();
  }

  @Get('tabledata')
  async getLowStockPartsTableData(@Query() query: unknown) {
    const { page, limit } = parseOrBadRequest(PaginationQuerySchema, query);
    return this.lowStockService.getLowStockPartTableData(page, limit);
  }

  @Get(':id')
  async getLowStockPartById(@Param('id', ParseIntPipe) id: number) {
    return this.lowStockService.getLowStockPartById(id);
  }
}
