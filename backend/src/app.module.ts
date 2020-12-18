import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ModuleMetadata } from '@nestjs/common/interfaces'

const metadata: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
}
@Module(metadata)
export class AppModule {}
