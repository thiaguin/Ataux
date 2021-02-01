import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware, AuthorizeColaboratorMiddleware } from 'src/auth/auth.middleware';
import { ListController } from './list.controller';
import { List } from './lists.entity';
import { ListService } from './lists.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([List])],
    providers: [ListService],
    controllers: [ListController],
    exports: [],
};

@Module(metadata)
export class ListModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: 'lists', method: RequestMethod.GET },
                { path: 'lists', method: RequestMethod.POST },
                { path: 'lists/:id', method: RequestMethod.GET },
                { path: 'lists/:id', method: RequestMethod.PUT },
            );
        consumer
            .apply(AuthorizeColaboratorMiddleware)
            .forRoutes({ path: 'lists', method: RequestMethod.POST }, { path: 'lists/:id', method: RequestMethod.PUT });
    }
}
