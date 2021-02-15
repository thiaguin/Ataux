import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
export class QuestionsModule {}
