import { Module } from '@nestjs/common';
import { PartkeeprDatabaseService } from '../partkeeprDatabase/partkeeprDatabase.service';
import { AuthModule } from '../auth/auth.module';
import { DigikeyController } from './digikey.controller';
import { DigikeyService } from './digikey.service';

@Module({
  //specify the controllers that will be used for LowStockModule specifies the routes and functions to get to the data
  controllers: [DigikeyController],
  imports: [AuthModule],
  //Specify the provider for the Module - the services the request data from the proxy
  providers: [DigikeyService, PartkeeprDatabaseService],
})
export class DigikeyModule {}
