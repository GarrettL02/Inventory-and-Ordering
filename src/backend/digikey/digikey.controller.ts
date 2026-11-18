import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/currentUser.decorator';
import * as authSchema from '../auth/schema/auth.schema';
import { DigikeyService } from './digikey.service';

@Controller('digikey')
@UseGuards(AuthGuard)
export class DigikeyController {
  constructor(private readonly digikeyService: DigikeyService) {}

  @Get('part/:id')
  getForPart(
    @CurrentUser() user: authSchema.AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.digikeyService.getForPart(user.id, id);
  }
}
