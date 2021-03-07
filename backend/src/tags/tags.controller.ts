import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTagDTO } from './dto/create-tag.dto';
import { FindAllTagDTO } from './dto/findAll-tag.dto';
import { QueryTagDTO } from './dto/query-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    private tag: TagsService;

    constructor() {
        this.tag = new TagsService();
    }

    @Get('/')
    findAll(@Query() query: QueryTagDTO): Promise<FindAllTagDTO> {
        return this.tag.findAndCountAll(query);
    }

    @Get('/:id')
    findById(@Param() params: { id: number }): Promise<Tag> {
        return this.tag.findById(params.id);
    }

    @Post('/')
    create(@Body() body: CreateTagDTO): Promise<Tag> {
        return this.tag.create(body);
    }

    @Put('/:id')
    @HttpCode(204)
    update(@Param() params: { id: number }, @Body() body: UpdateTagDTO) {
        return this.tag.update(params.id, body);
    }
}
