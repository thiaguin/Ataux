import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, Req } from '@nestjs/common';
import { AddQuestionListDTO } from './dto/addQuestion-list.dto';
import { CheckSubmissionListDTO } from './dto/checkSubmission-list.dto';
import { CreateListDTO } from './dto/create-list.dto';
import { FindAllListDTO } from './dto/findAll-list.dto';
import { UpdateListDTO } from './dto/update-list.dto';
import { List } from './lists.entity';
import { ListService } from './lists.service';

@Controller('lists')
export class ListController {
    private listService: ListService;

    constructor() {
        this.listService = new ListService();
    }

    @Get('/')
    findAll(@Query() query): Promise<FindAllListDTO> {
        return this.listService.findAll(query);
    }

    @Get('/:id')
    findById(@Param() params: { id: number }): Promise<List> {
        return this.listService.findById(params.id);
    }

    @Post('/')
    create(@Body() body: CreateListDTO): Promise<List> {
        return this.listService.create(body);
    }

    @Post('/:id/questions/submissions')
    checkSubmissions(@Param() params: { id: number }, @Req() req, @Body() body: CheckSubmissionListDTO): Promise<void> {
        return this.listService.checkSubmissions(params.id, req.user, body);
    }

    @Post('/:id/questions')
    addQuestions(@Param() params: { id: number }, @Body() body: AddQuestionListDTO): Promise<void> {
        return this.listService.addQuestions(params.id, body.questionIds);
    }

    @Put('/:id')
    @HttpCode(204)
    update(@Param() params: { id: number }, @Body() body: UpdateListDTO): Promise<void> {
        return this.listService.update(params, body);
    }
}
