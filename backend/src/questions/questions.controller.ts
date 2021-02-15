import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CheckSubmissionQuestionDTO } from './dto/checkSubmission-question.dto';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { FindAllQuestionDTO } from './dto/findAll-questions.dto';
import { QueryQuestionDTO } from './dto/query-question.dto';
import { UpdateQuestionDTO } from './dto/update-question.dto';
import { Question } from './questions.entity';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
    private questionService: QuestionsService;

    constructor() {
        this.questionService = new QuestionsService();
    }

    @Get('/')
    findAll(@Query() query: QueryQuestionDTO): Promise<FindAllQuestionDTO> {
        return this.questionService.findAndCountAll(query);
    }

    @Get('/url')
    findByURL(@Query() query: { url: string }): Promise<Question> {
        return this.questionService.findByURL(query.url);
    }

    @Get('/:id')
    findById(@Param() params: { id: number }): Promise<Question> {
        return this.questionService.findById(params.id);
    }

    @Post('/:id/submissions')
    checkSubmissions(@Param() params: { id: number }, @Body() body: CheckSubmissionQuestionDTO) {
        return this.questionService.checkSubmissions(params.id, body);
    }

    @Post('/')
    create(@Body() body: CreateQuestionDTO) {
        return this.questionService.create(body);
    }

    @Put('/:id')
    @HttpCode(204)
    update(@Param() params: { id: number }, @Body() body: UpdateQuestionDTO) {
        return this.questionService.update(params.id, body);
    }

    @Delete('/:id')
    @HttpCode(204)
    remove(@Param() params: { id: number }) {
        return this.questionService.remove(params.id);
    }
}
