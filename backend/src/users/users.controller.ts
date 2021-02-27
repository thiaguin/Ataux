import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreateUserClassDTO } from 'src/usersClasses/dto/create-user-class.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private userService: UsersService;

    constructor() {
        this.userService = new UsersService();
    }

    @Get('/')
    findAll(): Promise<{ users: User[]; count: number }> {
        return this.userService.findAndCountAll();
    }

    @Get('/:id')
    findOne(@Param() params: { id: number }): Promise<User> {
        return this.userService.findById(params.id);
    }

    @Post('/resetPassword')
    setCodeToResetPassord(@Body() body) {
        return this.userService.sendCodeToResetPassword(body);
    }

    @Put('/:id/resetPassword')
    resetPassword(@Param() params: { id: number }, @Body() body) {
        return this.userService.resetPassword(params.id, body);
    }

    @Put('/resetPassword')
    resetPasswordByURL(@Body() body) {
        return this.userService.resetPasswordByURL(body);
    }

    @Post('/google')
    createByGoogle(@Body() body: { token: string }): Promise<User> {
        return this.userService.createByGoogle(body);
    }

    @Post('/associate')
    associate(@Body() body: CreateUserClassDTO): Promise<UserClass> {
        return this.userService.associateUserToClass(body);
    }

    @Post('/')
    create(@Body() body: CreateUserDTO): Promise<User> {
        return this.userService.create(body);
    }
}
