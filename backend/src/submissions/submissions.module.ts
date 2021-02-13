import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Submission])],
    providers: [SubmissionsService],
    controllers: [SubmissionsController],
    exports: [],
};

@Module(metadata)
export class SubmissionsModule {}
