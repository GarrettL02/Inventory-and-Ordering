import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartService } from './parts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import type { AuthUser } from '../auth/auth.service';
import { AdjustStockSchema } from './schema/parts.schema';

@Controller('parts')
@UseGuards(AuthGuard)
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Get()
  async getAllParts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 15;
    return this.partService.getAllParts(pageNum, limitNum, search);
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
    const parsed = AdjustStockSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map((issue) => issue.message).join(', '),
      );
    }

    return this.partService.adjustStock(id, user.id, parsed.data);
  }
}
