import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { ListController } from './list.controller';
import { List } from './lists.entity';
import { ListService } from './lists.service';
import {
    AuthenticateMiddleware,
    MemberQueryMiddleware,
    PrivilegedRolesValidationMiddleware,
} from 'src/auth/auth.middleware';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([List]), SubmissionsModule, CodeforcesService],
    providers: [ListService],
    controllers: [ListController],
    exports: [ListService],
};

@Module(metadata)
export class ListModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticateMiddleware)
            .forRoutes(
                { path: 'lists/:id/questions/submissions', method: RequestMethod.POST },
                { path: 'lists/:id/questions', method: RequestMethod.POST },
                { path: 'lists/', method: RequestMethod.POST },
                { path: 'lists/:id/csv', method: RequestMethod.GET },
                { path: 'lists/:id/users', method: RequestMethod.GET },
                { path: 'lists/:id', method: RequestMethod.GET },
                { path: 'lists/', method: RequestMethod.GET },
                { path: 'lists/:id/resume', method: RequestMethod.GET },
                { path: 'lists/:id', method: RequestMethod.PUT },
                { path: 'lists/:id', method: RequestMethod.DELETE },
            );
        consumer
            .apply(PrivilegedRolesValidationMiddleware)
            .forRoutes(
                { path: 'lists/', method: RequestMethod.POST },
                { path: 'lists/:id/csv', method: RequestMethod.GET },
                { path: 'lists/:id', method: RequestMethod.PUT },
                { path: 'lists/:id', method: RequestMethod.DELETE },
            );
        consumer.apply(MemberQueryMiddleware).forRoutes({ path: 'lists/:id/users', method: RequestMethod.GET });
    }
}
