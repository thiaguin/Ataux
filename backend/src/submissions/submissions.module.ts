import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';
import { MemberQueryMiddleware, AuthenticateMiddleware } from '../auth/auth.middleware';
const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Submission])],
    providers: [SubmissionsService],
    controllers: [SubmissionsController],
    exports: [SubmissionsService],
};

@Module(metadata)
export class SubmissionsModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).forRoutes(
            // { path: 'lists', method: RequestMethod.GET },
            // { path: 'lists', method: RequestMethod.POST },
            // { path: 'lists/:id', method: RequestMethod.GET },
            // { path: 'lists/:id', method: RequestMethod.PUT },
            { path: 'submissions', method: RequestMethod.GET },
            { path: 'submissions/:id', method: RequestMethod.GET },
        );
        consumer.apply(MemberQueryMiddleware).forRoutes(
            // { path: 'lists', method: RequestMethod.GET },
            // { path: 'lists', method: RequestMethod.POST },
            // { path: 'lists/:id', method: RequestMethod.GET },
            // { path: 'lists/:id', method: RequestMethod.PUT },
            { path: 'submissions', method: RequestMethod.GET },
            { path: 'submissions/:id', method: RequestMethod.GET },
        );
        // consumer
        //     .apply(AuthorizeColaboratorMiddleware)
        //     .forRoutes({ path: 'lists', method: RequestMethod.POST }, { path: 'lists/:id', method: RequestMethod.PUT });
    }
}
