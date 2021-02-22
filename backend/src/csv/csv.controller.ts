import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClassesService } from 'src/classes/classes.service';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
    private csvService: CsvService;

    constructor() {
        this.csvService = new CsvService();
    }

    @Get('/classes')
    getClass(@Query() query, @Res() res: Response) {
        return this.csvService.getClass(query.classId, res);
    }

    @Get('/lists')
    getList(@Query() query, @Res() res: Response) {
        return this.csvService.getList(query.listId, res);
    }
}
