import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository, Repository } from 'typeorm';
import { CreateListDTO } from './dto/create-list.dto';
import { FindAllListDTO } from './dto/findAll-list.dto';
import { QueryListDTO } from './dto/query-list.dto';
import { UpdateListDTO } from './dto/update-list.dto';
import { List } from './lists.entity';
import { ListRepository } from './lists.repository';

@Injectable()
export class ListService {
  @InjectRepository(List)
  private repository: Repository<List>;

  constructor() {
    this.repository = getCustomRepository(ListRepository);
  }

  async create(body: CreateListDTO): Promise<List> {
    const newList = this.repository.create(body);
    await this.repository.save(newList);
    return newList;
  }

  async findAll(query: QueryListDTO): Promise<FindAllListDTO> {
    const where = { ...query };
    const [lists, count] = await this.repository.findAndCount({ where });
    return { data: lists, count };
  }

  async findById(id: number): Promise<List> {
    const list = await this.repository.findOne({
      where: { id: id },
      relations: ['questions'],
    });

    if (!list) {
      throw new HttpException('NotFound', 404);
    }

    return list;
  }

  async update(params: { id: number }, body: UpdateListDTO): Promise<void> {
    const list = await this.repository.findOne({
      where: { id: params.id },
    });

    if (!list) {
      throw new HttpException('NotFound', 404);
    }

    await this.repository.update({ id: params.id }, body);
  }
}
