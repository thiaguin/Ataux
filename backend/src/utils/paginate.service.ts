import { Injectable } from '@nestjs/common';
import { Page } from './dto/page.dto';

@Injectable()
export class PaginateService {
    getPage(query): Page {
        const ALL = 'ALL';
        const take = query.take || 30;
        const skip = take !== ALL && query.page ? query.page * take : 0;

        delete query.take;
        delete query.page;

        return {
            take: take === ALL ? null : take,
            skip: skip,
        };
    }
}
