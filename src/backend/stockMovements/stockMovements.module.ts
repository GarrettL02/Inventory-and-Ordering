import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { LowStockModule } from '../lowStockEvent/lowStockEvent.module';
import { StockMovementsController } from './stockMovements.controller';
import { Module } from '@nestjs/common';
import { StockMovementsService } from './stockMovements.service';

@Module({
  //specify the controllers that will be used for PartModule specifies the routes and functions to get to the data
  controllers: [StockMovementsController],
  imports: [AuthModule, DatabaseModule, LowStockModule],
  //Specify the provider for the Module - the services the request data from the database
  providers: [StockMovementsService],
  //PartModule uses StockMovementsService.record() when it creates a part with starting stock
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
