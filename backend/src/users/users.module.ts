import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity'
import { UsersController } from './users.controller';

const metadata: ModuleMetadata = {
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: []
} 

@Module(metadata)
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
