import { Module } from '@nestjs/common';
import { LowStockService } from './lowStockEvent.service';
import { LowStockController } from './lowStockEvent.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';

@Module({
  //specify the controllers that will be used for LowStockModule specifies the routes and functions to get to the data
  controllers: [LowStockController],
  imports: [AuthModule, DatabaseModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [LowStockService],
  //PartModule uses LowStockService when a part's stock changes
  exports: [LowStockService],
})
export class LowStockModule {}
