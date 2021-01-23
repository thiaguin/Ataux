import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateListDTO } from './dto/create-list.dto';
import { UpdateListDTO } from './dto/update-list.dto';
import { List } from './lists.entity';
import { ListService } from './lists.service';

@Controller('lists')
export class ListController {
  private listService: ListService;

  constructor() {
    this.listService = new ListService();
  }

  @Get('/')
  findAll(@Query() query): Promise<{ lists: List[]; count: number }> {
    return this.listService.findAll(query);
  }

  @Get('/:id')
  findById(@Param() params: { id: number }): Promise<List> {
    return this.listService.findById(params.id);
  }

  @Post('/')
  create(@Body() body: CreateListDTO): Promise<List> {
    return this.listService.create(body);
  }

  @Put('/:id')
  @HttpCode(204)
  update(
    @Param() params: { id: number },
    @Body() body: UpdateListDTO,
  ): Promise<void> {
    return this.listService.update(params, body);
  }
}
