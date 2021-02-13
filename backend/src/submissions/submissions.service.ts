import * as cheerio from 'cheerio';
import { HttpService, Injectable } from '@nestjs/common';
import { getCustomRepository, Repository } from 'typeorm';
import { Submission } from './submissions.entity';
import { SubmissionRepository } from './submissions.repository';
import * as request from 'request';

@Injectable()
export class SubmissionsService {
    // private repository: Repository<Submission>;
    private httpService: HttpService;
    private BASE_URL: string;

    constructor() {
        this.httpService = new HttpService();
        // this.repository = getCustomRepository(SubmissionRepository);
        this.BASE_URL = 'http://codeforces.com';
    }

    async getSourceCode(contestId: number, subId: number) {
        const url = `${this.BASE_URL}/contest/${contestId}/submission/${subId}`;
        const response = await this.httpService.get(url).toPromise();

        const $ = <any>cheerio.load(response.data);
        const sourceCode = $('.program-source')[0].children[0].data;

        return sourceCode;
    }
}
