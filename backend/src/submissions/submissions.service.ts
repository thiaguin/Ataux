import * as cheerio from 'cheerio';
import { HttpService, Injectable } from '@nestjs/common';
import { getCustomRepository, Repository } from 'typeorm';
import { Submission } from './submissions.entity';
import { SubmissionRepository } from './submissions.repository';
import { CodeforcesSubmissionDTO } from 'src/codeforces/dto/codeforces-submission.dto';
import { SubmissionAssociationDTO } from './submission-associations.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubmissionsService {
    @InjectRepository(Submission)
    private repository: Repository<Submission>;
    private httpService: HttpService;
    private BASE_URL: string;

    constructor() {
        this.repository = getCustomRepository(SubmissionRepository);
        this.httpService = new HttpService();
        this.BASE_URL = 'http://codeforces.com';
    }

    async findAll(query): Promise<Submission[]> {
        const submissions = await this.repository.find(query);
        return submissions;
    }

    async create(submission: CodeforcesSubmissionDTO, data: SubmissionAssociationDTO): Promise<Submission> {
        const createdTime = new Date(+`${submission.creationTimeSeconds}000`);
        const limitTime = new Date(data.limitTime);
        const exist = await this.repository.findOne({
            where: { subId: +submission.id, listId: data.listId, questionId: data.questionId },
        });

        if (!exist && createdTime <= limitTime) {
            const sourceCode = await this.getSourceCode(submission.contestId, submission.id);
            const newSubmission = this.repository.create({
                listQuestionId: data.listQuestionId,
                userId: data.userId,
                listId: data.listId,
                subId: +submission.id,
                questionId: data.questionId,
                status: submission.verdict,
                language: submission.programmingLanguage,
                time: submission.timeConsumedMillis,
                code: sourceCode,
                memory: submission.memoryConsumedBytes,
            });
            await this.repository.save(newSubmission);
            return newSubmission;
        }
    }

    async getSourceCode(contestId: string, subId: string) {
        const url = `${this.BASE_URL}/contest/${contestId}/submission/${subId}`;
        const response = await this.httpService.get(url).toPromise();

        const $ = <any>cheerio.load(response.data);
        const sourceCode = $('.program-source')[0].children[0].data;

        return sourceCode;
    }
}
