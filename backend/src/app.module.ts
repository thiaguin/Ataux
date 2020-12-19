import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { ModuleMetadata } from '@nestjs/common/interfaces';

const metadata: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UsersModule,
    ClassesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
};
@Module(metadata)
export class AppModule {}
