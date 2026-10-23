import { Module } from '@nestjs/common';
import { InventoryDatabaseService } from './inventoryDatabase.service';

// One shared database service (and one connection pool) for the whole app.
// Feature modules import DatabaseModule instead of providing the service themselves.
@Module({
  providers: [InventoryDatabaseService],
  exports: [InventoryDatabaseService],
})
export class DatabaseModule {}
