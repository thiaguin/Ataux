import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('/')
  create(@Body() body: CreateUserDTO): Promise<User> {
    return this.userService.create(body);
  }
}
