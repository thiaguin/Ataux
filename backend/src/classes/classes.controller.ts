import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';
import { CreateClassDTO } from './dto/create-class.dto';
import { QueryClassDTO } from './dto/query-class.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('classes')
export class ClassesController {
    private classService: ClassesService;

    constructor() {
        this.classService = new ClassesService();
    }

    @Get('/')
    findAll(@Query() query: QueryClassDTO): Promise<{ data: Class[]; count: number }> {
        return this.classService.findAndCountAll(query);
    }

    @Get('/:id')
    findById(@Param() params: { id: number }, @Req() req): Promise<Class> {
        return this.classService.findOne(params.id, req.user);
    }

    @Get('/:id/csv')
    getCSV(@Param() params: { id: number }, @Res() res: Response) {
        return this.classService.getToCSV(params.id, res);
    }

    @Get('/:id/resume')
    getResume(@Param() params: { id: number }): Promise<Class> {
        return this.classService.getResume(params.id);
    }

    @Post('/')
    create(@Body() body: CreateClassDTO, @Req() req): Promise<Class> {
        return this.classService.create(body, req.user);
    }

    @Post('/register')
    @HttpCode(204)
    register(@Body() body: RegisterUserDTO, @Req() req): Promise<void> {
        return this.classService.register(body, req.user);
    }

    @Post('/:id/add/users')
    @HttpCode(204)
    addUsers(@Param() params: { id: number }, @Body() body: { email: string }): Promise<void> {
        return this.classService.addUserByEmail(params.id, body.email);
    }

    @Put('/:id')
    update(@Param() params: { id: number }, @Body() body): Promise<void> {
        return this.classService.update(params.id, body);
    }

    @Delete('/:id')
    remove(@Param() params: { id: number }): Promise<void> {
        return this.classService.remove(params.id);
    }

    @Delete('/:id/users/:userId')
    removeUser(@Param() params: { id: number; userId: number }, @Req() req): Promise<void> {
        return this.classService.removeUser(params.id, params.userId, req.user);
    }
}
