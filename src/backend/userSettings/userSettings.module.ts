import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { UserSettingsController } from './userSettings.controller';
import { UserSettingsService } from './userSettings.service';

@Module({
  //specify the controllers that will be used for PartModule specifies the routes and functions to get to the data
  controllers: [UserSettingsController],
  imports: [AuthModule, DatabaseModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [UserSettingsService],
  //PartModule uses StockMovementsService.record() when it creates a part with starting stock
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
