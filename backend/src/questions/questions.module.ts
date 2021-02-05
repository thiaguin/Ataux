import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeforcesModule } from 'src/codeforces/codeforces.module';
import { TagsModule } from 'src/tags/tags.module';
import { QuestionsController } from './questions.controller';
import { Question } from './questions.entity';
import { QuestionsService } from './questions.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Question]), CodeforcesModule, TagsModule],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [],
};

@Module(metadata)
export class QuestionsModule {}
