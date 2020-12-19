import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository, Repository } from 'typeorm';
import { Class } from './classes.entity';
import { ClassRepository } from './classes.repository';
import { CreateClassDTO } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  @InjectRepository(Class)
  private repository: Repository<Class>;

  constructor() {
    this.repository = getCustomRepository(ClassRepository);
  }

  async findAndCountAll(): Promise<{ classes: Class[]; count: number }> {
    const [classes, count] = await this.repository.findAndCount();
    return { classes, count };
  }

  async create(body: CreateClassDTO): Promise<Class> {
    const entity = this.repository.create(body);
    await this.repository.save(entity);
    return entity;
  }
}
