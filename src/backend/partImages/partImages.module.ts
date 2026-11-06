import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../databaseService/database.module';
import { PartImagesController } from './partImages.controller';
import { PartImagesService } from './partImages.service';

@Module({
  controllers: [PartImagesController],
  imports: [AuthModule, DatabaseModule],
  providers: [PartImagesService],
  // PartService uses PartImagesService to delete a part's files when the part is deleted
  exports: [PartImagesService],
})
export class PartImagesModule {}
