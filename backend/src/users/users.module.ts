import { Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { AuthenticateMiddleware } from 'src/auth/auth.middleware';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([User]), CodeforcesService],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
};

@Module(metadata)
export class UsersModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).forRoutes(
            // { path: 'lists', method: RequestMethod.GET },
            // { path: 'lists', method: RequestMethod.POST },
            // { path: 'lists/:id', method: RequestMethod.GET },
            // { path: 'lists/:id', method: RequestMethod.PUT },
            // { path: 'lists/:id/questions/submissions', method: RequestMethod.POST },
            { path: 'users/:id', method: RequestMethod.DELETE },
            // { path: 'lists/:id/users', method: RequestMethod.GET },
        );
    }
}
