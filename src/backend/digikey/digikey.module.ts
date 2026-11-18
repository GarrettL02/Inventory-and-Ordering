import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { DigikeyController } from './digikey.controller';
import { DigikeyService } from './digikey.service';
import { UserSettingsModule } from '../userSettings/userSettings.module';

@Module({
  //specify the controllers that will be used for DigikeyModule specifies the routes and functions to get to the data
  controllers: [DigikeyController],
  imports: [AuthModule, DatabaseModule, UserSettingsModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [DigikeyService],
})
export class DigikeyModule {}
