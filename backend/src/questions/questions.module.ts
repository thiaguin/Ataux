import { MiddlewareConsumer, Module, ModuleMetadata, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware } from 'src/auth/auth.middleware';
import { CodeforcesModule } from 'src/codeforces/codeforces.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { TagsModule } from 'src/tags/tags.module';
import { QuestionsController } from './questions.controller';
import { Question } from './questions.entity';
import { QuestionsService } from './questions.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Question]), CodeforcesModule, TagsModule, SubmissionsModule],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [QuestionsService],
};

@Module(metadata)
export class QuestionsModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticateMiddleware).forRoutes(
            // { path: 'lists', method: RequestMethod.GET },
            // { path: 'lists', method: RequestMethod.POST },
            // { path: 'lists/:id', method: RequestMethod.GET },
            // { path: 'lists/:id', method: RequestMethod.PUT },
            // { path: 'lists/:id/questions/submissions', method: RequestMethod.POST },
            { path: 'questions/:id', method: RequestMethod.GET },
            // { path: 'lists/:id/users', method: RequestMethod.GET },
        );
    }
}
