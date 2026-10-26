import { Module } from '@nestjs/common';
import { PartService } from './parts.service';
import { PartController } from './parts.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { LowStockModule } from '../lowStockEvent/lowStockEvent.module';
import { StockMovementsModule } from '../stockMovements/stockMovements.module';

@Module({
  //specify the controllers that will be used for PartModule specifies the routes and functions to get to the data
  controllers: [PartController],
  imports: [AuthModule, DatabaseModule, LowStockModule, StockMovementsModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [PartService],
})
export class PartModule {}
