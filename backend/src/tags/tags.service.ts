import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository, Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import { FindAllTagDTO } from './dto/findAll-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { Tag } from './tags.entity';
import { TagRepository } from './tags.repository';

@Injectable()
export class TagsService {
    @InjectRepository(Tag)
    private repository: Repository<Tag>;

    constructor() {
        this.repository = getCustomRepository(TagRepository);
    }

    async findAndCountAll(): Promise<FindAllTagDTO> {
        const [tags, count] = await this.repository.findAndCount();

        return { data: tags, count };
    }

    async findById(id: number): Promise<Tag> {
        const tag = await this.repository.findOne({ where: { id } });

        if (tag) {
            return tag;
        }

        throw new HttpException('NotFound', 404);
    }

    async create(body: CreateTagDTO): Promise<Tag> {
        const newTag = this.repository.create(body);
        await this.repository.save(newTag);
        return newTag;
    }

    async update(id: number, body: UpdateTagDTO): Promise<void> {
        const tag = await this.repository.findOne({
            where: { id },
        });

        if (!tag) {
            throw new HttpException('NotFound', 404);
        }

        await this.repository.update({ id }, body);
    }
}
