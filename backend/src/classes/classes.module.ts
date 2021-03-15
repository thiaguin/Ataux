import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware, MemberQueryMiddleware } from 'src/auth/auth.middleware';
import { ListModule } from 'src/list/lists.module';
import { ClassesController } from './classes.controller';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Class]), ListModule],
    providers: [ClassesService],
    controllers: [ClassesController],
    exports: [],
};

@Module(metadata)
export class ClassesModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: '/classes', method: RequestMethod.POST },
                { path: '/classes', method: RequestMethod.GET },
                { path: '/classes/:id', method: RequestMethod.GET },
                { path: '/classes/register', method: RequestMethod.POST },
            );
        consumer.apply(MemberQueryMiddleware).forRoutes({ path: '/classes', method: RequestMethod.GET });
    }
}
