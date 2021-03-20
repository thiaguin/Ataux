import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware, PrivilegedRolesValidationMiddleware } from 'src/auth/auth.middleware';
import { TagsController } from './tags.controller';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService],
};

@Module(metadata)
export class TagsModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: 'tags/:id', method: RequestMethod.GET },
                { path: 'tags/', method: RequestMethod.GET },
                { path: 'tags/', method: RequestMethod.POST },
                { path: 'tags/:id', method: RequestMethod.PUT },
                { path: 'tags/:id', method: RequestMethod.DELETE },
            );
        consumer
            .apply(PrivilegedRolesValidationMiddleware)
            .forRoutes(
                { path: 'tags/', method: RequestMethod.POST },
                { path: 'tags/:id', method: RequestMethod.PUT },
                { path: 'tags/:id', method: RequestMethod.DELETE },
            );
    }
}
