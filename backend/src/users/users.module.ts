import { Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { AdminValidationMiddleware, AuthenticateMiddleware } from 'src/auth/auth.middleware';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([User]), CodeforcesService],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
};

@Module(metadata)
export class UsersModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: 'users/existHandle', method: RequestMethod.GET },
                { path: 'users/:id', method: RequestMethod.GET },
                { path: 'users/', method: RequestMethod.GET },
                { path: 'users/associate', method: RequestMethod.POST },
                { path: 'users/:id', method: RequestMethod.PUT },
                { path: 'users/:id', method: RequestMethod.DELETE },
            );
        consumer.apply(AdminValidationMiddleware).forRoutes({ path: 'users/:id', method: RequestMethod.DELETE });
    }
}
