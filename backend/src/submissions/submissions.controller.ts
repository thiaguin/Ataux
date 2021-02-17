import { Controller, Get, Query } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
    private submissionService: SubmissionsService;

    constructor() {
        this.submissionService = new SubmissionsService();
    }

    @Get('/')
    findAll(@Query() query) {
        console.log('here');
        return this.submissionService.getUserSubmission(query);
    }
}
