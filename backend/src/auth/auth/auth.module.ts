import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const metadata: ModuleMetadata = {
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
};

@Module(metadata)
export class AuthModule {}
