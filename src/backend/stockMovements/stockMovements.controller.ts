import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import type { AuthUser } from '../auth/schema/auth.schema';
import { parseOrBadRequest } from '../common/parseOrBadRequest';
import { StockMovementsService } from './stockMovements.services';
import { AdjustStockSchema } from './schema/stockMovements.schema';

@Controller('stockmovements')
@UseGuards(AuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  // Stock history for one part (id = the part's id)
  @Get(':id')
  async getStockDataById(@Param('id', ParseIntPipe) partId: number) {
    return this.stockMovementsService.getStockDataById(partId);
  }

  // Add or remove stock for a part (id = the part's id).
  // Body: { "delta": -2, "reason": "used on job" }
  //   delta > 0 adds stock, delta < 0 removes it, reason is optional
  // -> 201 with { partId, stockLevel, minStockLevel, lowStockEventId }
  @Post(':id')
  async adjustStock(
    @Param('id', ParseIntPipe) partId: number,
    @Body() body: unknown,
    @CurrentUser() user: AuthUser,
  ) {
    const input = parseOrBadRequest(AdjustStockSchema, body);
    return this.stockMovementsService.adjustStock(partId, user.id, input);
  }
}
