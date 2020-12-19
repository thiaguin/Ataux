import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';

const metadata: ModuleMetadata = {
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [],
};

@Module(metadata)
export class ClassesModule {}
