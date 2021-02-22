import { Module, ModuleMetadata } from '@nestjs/common';
import { ClassesModule } from 'src/classes/classes.module';
import { ListModule } from 'src/list/lists.module';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';

const metadata: ModuleMetadata = {
    imports: [ClassesModule, ListModule],
    providers: [CsvService],
    controllers: [CsvController],
    exports: [],
};

@Module(metadata)
export class CsvModule {}
