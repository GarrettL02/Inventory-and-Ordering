import { Module } from '@nestjs/common';
import { LowStockService } from './lowStockEvent.service';
import { LowStockController } from './lowStockEvent.controller';
import { PartkeeprDatabaseService } from '../partkeeprDatabase/partkeeprDatabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  //specify the controllers that will be used for LowStockModule specifies the routes and functions to get to the data
  controllers: [LowStockController],
  imports: [AuthModule],
  //Specify the provider for the Module - the services the request data from the proxy
  providers: [LowStockService, PartkeeprDatabaseService],
})
export class LowStockModule {}
