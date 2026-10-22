import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DigikeyService } from './digikey.service';

@Controller('digikey')
@UseGuards(AuthGuard)
export class DigikeyController {
  constructor(private readonly digikeyService: DigikeyService) {}

  @Get('part/:id')
  getForPart(@Param('id', ParseIntPipe) id: number) {
    return this.digikeyService.getForPart(id);
  }
}
