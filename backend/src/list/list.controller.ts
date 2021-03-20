import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserList } from 'src/userList/userList.entity';
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
    findById(@Param() params: { id: number }, @Req() req): Promise<List> {
        return this.listService.findOne(params.id, req.user);
    }

    @Get('/:id/csv')
    getCSV(@Param() params: { id: number }, @Res() res: Response) {
        return this.listService.getToCSV(params.id, res);
    }

    @Get('/:id/resume')
    getResume(@Param() params: { id: number }, @Query() query): Promise<List> {
        return this.listService.getResume(params.id, query);
    }

    @Get('/:id/users')
    getListUsers(@Param() params: { id: number }, @Query() query): Promise<UserList[]> {
        return this.listService.getUsersList(params.id, query);
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
        return this.listService.setQuestions(params.id, body.questionIds);
    }

    @Put('/:id')
    @HttpCode(204)
    update(@Param() params: { id: number }, @Body() body: UpdateListDTO): Promise<void> {
        return this.listService.update(params, body);
    }

    @Delete('/:id')
    @HttpCode(204)
    remove(@Param() params: { id: number }) {
        return this.listService.remove(params.id);
    }
}
