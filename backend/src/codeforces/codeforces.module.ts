import { HttpModule, Module, ModuleMetadata } from '@nestjs/common';
import { CodeforcesService } from './codeforces.service';

const metadata: ModuleMetadata = {
    imports: [HttpModule],
    providers: [CodeforcesService],
    controllers: [],
    exports: [CodeforcesService],
};

@Module(metadata)
export class CodeforcesModule {}
