import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartService } from './parts.service';
import { AuthGuard } from '../auth/auth.guard';
import { setMaxParserCache } from 'mysql2';

@Controller('parts')
@UseGuards(AuthGuard)
export class PartController {
  constructor(private readonly lowStockService: PartService) {}

  @Get()
  async getAllParts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 15;
    return this.lowStockService.getAllParts(pageNum, limitNum, search);
  }

  @Get(':id')
  async getPartById(@Param('id', ParseIntPipe) id: number) {
    return this.lowStockService.getPartById(id);
  }
}
