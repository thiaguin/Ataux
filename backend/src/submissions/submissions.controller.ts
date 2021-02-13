import { Controller, Get, Query } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
    private submissionService: SubmissionsService;

    constructor() {
        this.submissionService = new SubmissionsService();
    }

    @Get('/')
    findAll() {
        return this.submissionService.getSourceCode(1178, 100487295);
    }
}
