import { Controller, UseGuards, Get, Body, Put } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserSettingsService } from './userSettings.service';
import { CurrentUser } from '../auth/currentUser.decorator';
import * as authSchema from '../auth/schema/auth.schema';
import { parseOrBadRequest } from '../common/parseOrBadRequest';
import { UpdateUserSettingsSchema } from './schema/userSettings.schema';

@Controller('usersettings')
@UseGuards(AuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  // Recent Stock history for one part (id = the part's id)
  @Get()
  async getUserSettings(@CurrentUser() user: authSchema.AuthUser) {
    return this.userSettingsService.getUserSettings(user.id);
  }

  @Put() updateSettings(
    @CurrentUser() user: authSchema.AuthUser,
    @Body() body: unknown,
  ) {
    const input = parseOrBadRequest(UpdateUserSettingsSchema, body);
    return this.userSettingsService.updateSettings(user.id, input);
  }
}
