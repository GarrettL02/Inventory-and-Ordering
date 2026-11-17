import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { PartDistributorController } from './partDistributor.controller';
import { PartDistributorService } from './partDistributor.service';

@Module({
  //specify the controllers that will be used for LowStockModule specifies the routes and functions to get to the data
  controllers: [PartDistributorController],
  imports: [AuthModule, DatabaseModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [PartDistributorService],
  //PartModule uses LowStockService when a part's stock changes
  exports: [PartDistributorService],
})
export class PartDistributorModule {}
