import {
  MiddlewareConsumer,
  Module,
  ModuleMetadata,
  RequestMethod,
} from '@nestjs/common';
import {
  AuthenticateMiddleware,
  AuthorizeColaboratorMiddleware,
} from 'src/auth/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { Question } from './questions.entity';
import { QuestionsService } from './questions.service';

const metadata: ModuleMetadata = {
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [],
};

@Module(metadata)
export class QuestionsModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.GET },
        { path: 'questions', method: RequestMethod.POST },
        { path: 'questions/:id', method: RequestMethod.GET },
        { path: 'questions/:id', method: RequestMethod.PUT },
      );
    consumer
      .apply(AuthorizeColaboratorMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.POST },
        { path: 'questions/:id', method: RequestMethod.PUT },
        { path: 'questions/:id', method: RequestMethod.DELETE },
      );
  }
}
