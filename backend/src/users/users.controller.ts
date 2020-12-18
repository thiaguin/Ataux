import { Controller, Get, Post } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service'

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
    create(): Promise<User> {
        return this.userService.create()
    }

}
