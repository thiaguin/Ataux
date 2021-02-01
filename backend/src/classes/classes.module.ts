import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware } from 'src/auth/auth.middleware';
import { ClassesController } from './classes.controller';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Class])],
    providers: [ClassesService],
    controllers: [ClassesController],
    exports: [],
};

@Module(metadata)
export class ClassesModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).forRoutes({ path: '/classes', method: RequestMethod.POST });
    }
}
