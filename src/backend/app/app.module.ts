import { Module } from '@nestjs/common';
import { LowStockModule } from '../lowStockEvent/lowStockEvent.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PartModule } from '../parts/parts.module';
import { AuthModule } from '../auth/auth.module';
import { DigikeyModule } from '../digikey/digikey.module';
import { StockMovementsModule } from '../stockMovements/stockMovements.module';
import { StorageLocationsModule } from '../storageLocations/storageLocations.module';

const frontendBuildPath =
  process.env.FRONTEND_BUILD_PATH ??
  join(__dirname, '..', '..', 'src', 'frontend', 'build');

console.log('Serving static from:', frontendBuildPath);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: frontendBuildPath,
      exclude: ['/api'],
    }),
    LowStockModule,
    PartModule,
    AuthModule,
    DigikeyModule,
    StockMovementsModule,
    StorageLocationsModule,
  ],
})
export class AppModule {}
