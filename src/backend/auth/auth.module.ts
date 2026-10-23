import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { DatabaseModule } from '../databaseService/database.module';

@Module({
  imports: [DatabaseModule],
  //specify the controllers that will be used for Authmodule specifies the routes and functions to get to the data
  controllers: [AuthController],
  //Specify the provider for the Module - the services the request data from the proxy
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
