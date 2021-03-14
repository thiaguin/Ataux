import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NOT_FOUND, NOT_UNIQUE } from 'src/resource/errorType.resource';
import { PaginateService } from 'src/utils/paginate.service';
import { QueryService } from 'src/utils/query.service';
import { getCustomRepository, Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import { FindAllTagDTO } from './dto/findAll-tag.dto';
import { QueryTagDTO } from './dto/query-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { Tag } from './tags.entity';
import { TagRepository } from './tags.repository';

@Injectable()
export class TagsService {
    @InjectRepository(Tag)
    private repository: Repository<Tag>;
    private paginateService: PaginateService;
    private queryService: QueryService;

    constructor() {
        this.repository = getCustomRepository(TagRepository);
        this.paginateService = new PaginateService();
        this.queryService = new QueryService();
    }

    async findAndCountAll(query: QueryTagDTO): Promise<FindAllTagDTO> {
        const page = this.paginateService.getPage(query);
        const where = this.queryService.getQueryToFind(Tag, query);
        const [tags, count] = await this.repository.findAndCount({
            ...page,
            where,
            order: { id: 'ASC' },
        });

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

        throw new HttpException({ entity: 'Tag', type: NOT_FOUND }, 404);
    }

    async create(body: CreateTagDTO): Promise<Tag> {
        const tag = await this.repository.findOne({
            where: { name: body.name },
        });

        if (tag) throw new HttpException({ entity: 'Tag', type: NOT_UNIQUE }, 404);

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
            throw new HttpException({ entity: 'Tag', type: NOT_FOUND }, 404);
        }

        await this.repository.update({ id }, body);
    }
}
