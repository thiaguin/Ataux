import { Module, ModuleMetadata } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
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
