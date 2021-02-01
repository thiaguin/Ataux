import { Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
};

@Module(metadata)
export class UsersModule {}
