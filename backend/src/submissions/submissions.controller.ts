import { Controller, Get, Param, Query } from '@nestjs/common';
import { Submission } from './submissions.entity';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
    private submissionService: SubmissionsService;

    constructor() {
        this.submissionService = new SubmissionsService();
    }

    @Get('/')
    findAll(@Query() query): Promise<{ data: Submission[]; count: number }> {
        return this.submissionService.findAll(query);
    }

    @Get('/:id')
    findOne(@Param() params: { id: number }, @Query() query): Promise<Submission> {
        return this.submissionService.findOne(params.id, query);
    }
}
