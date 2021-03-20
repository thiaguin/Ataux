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
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: 'submissions', method: RequestMethod.GET },
                { path: 'submissions/:id', method: RequestMethod.GET },
            );
        consumer
            .apply(MemberQueryMiddleware)
            .forRoutes(
                { path: 'submissions', method: RequestMethod.GET },
                { path: 'submissions/:id', method: RequestMethod.GET },
            );
    }
}
