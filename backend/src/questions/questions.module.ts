import { Module, ModuleMetadata } from '@nestjs/common';
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
export class QuestionsModule {}
