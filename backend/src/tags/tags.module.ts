import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';

const metadata: ModuleMetadata = {
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService],
};

@Module(metadata)
export class TagsModule {}
