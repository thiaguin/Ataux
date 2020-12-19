import { Body, Controller, Get, Post } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service'
import { UserRepository } from './users.repository';

@Controller('users')
export class UsersController {
    private userService: UsersService

    constructor() {

        this.userService = new UsersService()
    }

    @Get('/')
    findAll(): Promise<{ users: User[], count: number }> {
        return this.userService.findAll()
    }

    @Post('/')
    create(@Body() body: CreateUserDTO ): Promise<User> {
        return this.userService.create(body)
    }

}
