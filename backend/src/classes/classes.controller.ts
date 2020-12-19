import { Body, Controller, Get, Post } from '@nestjs/common';
import { Class } from './classes.entity';
import { ClassesService } from './classes.service';
import { CreateClassDTO } from './dto/create-class.dto';

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

  @Post('/')
  create(@Body() body: CreateClassDTO): Promise<Class> {
    return this.classService.create(body);
  }
}
