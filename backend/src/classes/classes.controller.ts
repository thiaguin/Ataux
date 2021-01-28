import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';
import { CreateClassDTO } from './dto/create-class.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('classes')
export class ClassesController {
  private classService: ClassesService;

  constructor() {
    this.classService = new ClassesService();
  }

  @Get('/')
  findAll(): Promise<{ classes: Class[]; count: number }> {
    return this.classService.findAndCountAll();
  }

  @Get('/:id')
  findById(@Param() params: { id: number }): Promise<Class> {
    return this.classService.findById(params.id);
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
}
