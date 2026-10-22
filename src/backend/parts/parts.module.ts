import { Module } from '@nestjs/common';
import { PartkeeprDatabaseService } from '../partkeeprDatabase/partkeeprDatabase.service';
import { PartService } from './parts.service';
import { PartController } from './parts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  //specify the controllers that will be used for LowStockModule specifies the routes and functions to get to the data
  controllers: [PartController],
  imports: [AuthModule],
  //Specify the provider for the Module - the services the request data from the proxy
  providers: [PartService, PartkeeprDatabaseService],
})
export class PartModule {}
