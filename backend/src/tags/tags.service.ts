import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
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

    async findMany(titles: string[]): Promise<Tag[]> {
        const where = titles.map((title) => ({ name: title }));
        const tags = await this.repository.find({
            where: where,
        });

        return tags;
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

    async createMany(tags: string[]): Promise<Tag[]> {
        const tagsToCreate = [];

        for (const tag of tags) {
            const newTag = this.repository.create({ name: tag });
            tagsToCreate.push(newTag);
        }

        return tagsToCreate;
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
