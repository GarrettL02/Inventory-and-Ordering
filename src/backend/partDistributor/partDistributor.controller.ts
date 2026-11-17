import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import { PartDistributorService } from './partDistributor.service';

@Controller('partdistributor')
@UseGuards(AuthGuard)
export class PartDistributorController {
  constructor(
    private readonly partDistributorService: PartDistributorService,
  ) {}

  @Get(':partId')
  async getLowStockParts(@Param('partId', ParseIntPipe) partId: number) {
    return this.partDistributorService.getPartDistributorsById(partId);
  }
}
