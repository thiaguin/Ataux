import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AuthenticateMiddleware,
    AuthorizeColaboratorMiddleware,
    MemberQueryMiddleware,
} from 'src/auth/auth.middleware';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { QuestionsModule } from 'src/questions/questions.module';
import { SubmissionsController } from 'src/submissions/submissions.controller';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { ListController } from './list.controller';
import { List } from './lists.entity';
import { ListService } from './lists.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([List]), SubmissionsModule, CodeforcesService],
    providers: [ListService],
    controllers: [ListController],
    exports: [ListService],
};

@Module(metadata)
export class ListModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).forRoutes(
            // { path: 'lists', method: RequestMethod.GET },
            // { path: 'lists', method: RequestMethod.POST },
            // { path: 'lists/:id', method: RequestMethod.GET },
            // { path: 'lists/:id', method: RequestMethod.PUT },
            { path: 'lists/:id/questions/submissions', method: RequestMethod.POST },
            { path: 'lists/:id', method: RequestMethod.GET },
            { path: 'lists/:id/users', method: RequestMethod.GET },
        );
        consumer.apply(MemberQueryMiddleware).forRoutes({ path: 'lists/:id/users', method: RequestMethod.GET });
        // consumer
        //     .apply(AuthorizeColaboratorMiddleware)
        //     .forRoutes({ path: 'lists', method: RequestMethod.POST }, { path: 'lists/:id', method: RequestMethod.PUT });
    }
}
