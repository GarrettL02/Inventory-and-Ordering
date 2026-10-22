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

@Controller('lowstock')
@UseGuards(AuthGuard)
export class LowStockController {
  constructor(private readonly lowStockService: LowStockService) {}

  @Get()
  async getLowStockParts() {
    return this.lowStockService.getLowStockParts();
  }

  @Get('tabledata')
  async getLowStockPartsTableData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '15', 10);
    return this.lowStockService.getLowStockPartTableData(pageNum, limitNum);
  }

  @Get(':id')
  async getLowStockPartById(@Param('id', ParseIntPipe) id: number) {
    return this.lowStockService.getLowStockPartById(id);
  }
}
