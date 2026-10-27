import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { Module } from '@nestjs/common';
import { StorageLocationsService } from './storageLocations.service';
import { StorageLocationsController } from './storageLocations.controller';

@Module({
  //specify the controllers that will be used for PartModule specifies the routes and functions to get to the data
  controllers: [StorageLocationsController],
  imports: [AuthModule, DatabaseModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [StorageLocationsService],
  //PartModule uses StockMovementsService.record() when it creates a part with starting stock
  exports: [StorageLocationsService],
})
export class StorageLocationsModule {}
